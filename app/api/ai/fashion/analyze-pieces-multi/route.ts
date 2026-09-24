import { NextRequest, NextResponse } from 'next/server';

interface DetectedPiece {
  name: string;
  piece_type: string;
  color: string;
  material: string;
  occasion_tags: string[];
  style_tags: string[];
  brand: string;
  description: string;
}

const PIECE_TYPE_MAP: Record<string, string> = {
  'camiseta': 'upper_piece', 'camisa': 'upper_piece', 'blusa': 'upper_piece',
  'casaco': 'upper_piece', 'jaqueta': 'upper_piece', 'suéter': 'upper_piece',
  'moletom': 'upper_piece', 'top': 'upper_piece', 'regata': 'upper_piece',
  'calça': 'lower_piece', 'jeans': 'lower_piece', 'saia': 'lower_piece',
  'bermuda': 'lower_piece', 'shorts': 'lower_piece',
  'vestido': 'upper_piece', 'macacão': 'upper_piece',
  'sapato': 'footwear', 'tênis': 'footwear', 'bota': 'footwear',
  'sandália': 'footwear', 'chinelo': 'footwear', 'scarpin': 'footwear',
  'bolsa': 'accessory_piece', 'cinto': 'accessory_piece', 'chapéu': 'accessory_piece',
  'boné': 'accessory_piece', 'cachecol': 'accessory_piece',
};

function guessPieceType(name: string): string {
  const lower = name.toLowerCase();
  for (const [keyword, type] of Object.entries(PIECE_TYPE_MAP)) {
    if (lower.includes(keyword)) return type;
  }
  return 'upper_piece';
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { base64Image, mimeType } = body;

    if (!base64Image) {
      return NextResponse.json({ ok: false, message: 'Missing base64Image' }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ ok: false, message: 'ANTHROPIC_API_KEY not configured' }, { status: 500 });
    }

    const prompt = `Você é um especialista em moda. Analise esta imagem e identifique TODAS as peças de roupa e acessórios visíveis.

Para as cores, use nomes em português da lista: Preto, Branco, Cinza, Grafite, Prata, Azul-marinho, Azul, Azul-claro, Vermelho, Bordô, Rosa, Coral, Verde, Verde-oliva, Amarelo, Dourado, Mostarda, Laranja, Ferrugem, Marrom, Bege, Creme, Roxo, Lavanda, Multicolorido.

Para cada peça identificada, retorne um objeto JSON com:
- name: nome descritivo incluindo cor (ex: "Camisa Social Branca", "Calça Jeans Azul")
- piece_type: tipo da peça (use exatamente: upper_piece, lower_piece, footwear, accessory_piece)
- color: cor principal EXATA da peça em português (use a lista acima)
- material: material estimado (ex: algodão, jeans, couro) ou vazio se não souber
- occasion_tags: array com tags de ocasião da lista: ["Trabalho", "Casual", "Festa", "Academia", "Evento"]
- style_tags: array com tags de estilo da lista: ["Casual", "Formal", "Streetwear", "Sport", "Luxury", "Classic", "Vintage", "Minimal"]
- brand: marca se visível, senão string vazia
- description: breve descrição de 1 frase mencionando cor e tipo

Retorne APENAS JSON válido no formato:
{
  "pieces": [
    {
      "name": "...",
      "piece_type": "...",
      "color": "...",
      "material": "...",
      "occasion_tags": [],
      "style_tags": [],
      "brand": "...",
      "description": "..."
    }
  ]
}`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 2048,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: mimeType || 'image/jpeg',
                  data: base64Image.replace(/^data:image\/\w+;base64,/, ''),
                },
              },
              { type: 'text', text: prompt },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('[analyze-pieces-multi] Claude API error:', err);
      return NextResponse.json({ ok: false, message: 'Claude API error' }, { status: 500 });
    }

    const data = await response.json();
    const text = data.content?.[0]?.text ?? '';
    const clean = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean) as { pieces: DetectedPiece[] };

    if (!Array.isArray(parsed.pieces)) {
      return NextResponse.json({ ok: false, message: 'Invalid response from Claude' }, { status: 500 });
    }

    const pieces = parsed.pieces.map((piece) => ({
      ...piece,
      piece_type: ['upper_piece', 'lower_piece', 'footwear', 'accessory_piece'].includes(piece.piece_type)
        ? piece.piece_type
        : guessPieceType(piece.name),
    }));

    return NextResponse.json({ ok: true, pieces });
  } catch (error) {
    console.error('[analyze-pieces-multi] Error:', error);
    return NextResponse.json({ ok: false, message: 'Internal error' }, { status: 500 });
  }
}