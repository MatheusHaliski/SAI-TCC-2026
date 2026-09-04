import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.base64Image && !body.imageUrl) {
      return NextResponse.json(
        { ok: false, provider: 'claude', failedStage: 'analyze_piece', message: 'Missing base64Image or imageUrl', fallbackUsed: false },
        { status: 400 }
      );
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;

    // Se não tiver chave do Claude, usa fallback heurístico
    if (!apiKey) {
      console.warn('[analyze-piece] ANTHROPIC_API_KEY not set, using fallback');
      return NextResponse.json({
        ok: true,
        fallbackUsed: true,
        provider: 'fallback',
        data: {
          pieceName: '',
          bodyRegion: 'upper',
          gender: 'unisex',
          primaryColor: '',
          secondaryColors: [],
          materials: [],
          styles: [],
          semanticTags: [],
          brand: '',
          season: 'all-season',
          shortDescription: '',
        },
      });
    }

    const prompt = `Você é um especialista em moda. Analise esta imagem de peça de roupa e retorne as informações em JSON.

Para as cores, use nomes em português da lista: Preto, Branco, Cinza, Grafite, Prata, Azul-marinho, Azul, Azul-claro, Vermelho, Bordô, Rosa, Coral, Verde, Verde-oliva, Amarelo, Dourado, Mostarda, Laranja, Ferrugem, Marrom, Bege, Creme, Roxo, Lavanda, Multicolorido.

Retorne APENAS JSON válido no formato:
{
  "pieceName": "nome descritivo da peça incluindo a cor principal (ex: Camisa Social Branca)",
  "bodyRegion": "upper ou lower ou shoes ou accessory",
  "gender": "male ou female ou unisex",
  "primaryColor": "cor principal exata da peça em português",
  "secondaryColors": ["outras cores visíveis se houver"],
  "materials": ["materiais estimados em português"],
  "styles": ["estilos: Casual, Formal, Streetwear, Sport, Luxury, Classic, Vintage, Minimal"],
  "semanticTags": ["tags descritivas adicionais"],
  "brand": "marca se visível, senão string vazia",
  "season": "summer, winter, spring, autumn ou all-season",
  "shortDescription": "descrição curta de 1 frase mencionando cor e tipo"
}`;

    const messageContent: Array<{ type: string; [key: string]: unknown }> = [];

    if (body.base64Image) {
      messageContent.push({
        type: 'image',
        source: {
          type: 'base64',
          media_type: body.mimeType || 'image/jpeg',
          data: body.base64Image.replace(/^data:image\/\w+;base64,/, ''),
        },
      });
    } else if (body.imageUrl) {
      messageContent.push({
        type: 'image',
        source: {
          type: 'url',
          url: body.imageUrl,
        },
      });
    }

    messageContent.push({ type: 'text', text: prompt });

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        messages: [{ role: 'user', content: messageContent }],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('[analyze-piece] Claude API error:', response.status, err);
      return NextResponse.json(
        { ok: false, provider: 'claude', failedStage: 'analyze_piece', message: 'Claude API error', fallbackUsed: true },
        { status: 500 }
      );
    }

    const data = await response.json();
    const text = data.content?.[0]?.text ?? '';
    const clean = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean);

    return NextResponse.json({
      ok: true,
      data: parsed,
      provider: 'claude',
      fallbackUsed: false,
    });
  } catch (error: unknown) {
    console.error('[POST /api/ai/fashion/analyze-piece] Error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { ok: false, provider: 'claude', failedStage: 'analyze_piece', message, fallbackUsed: true },
      { status: 500 }
    );
  }
}