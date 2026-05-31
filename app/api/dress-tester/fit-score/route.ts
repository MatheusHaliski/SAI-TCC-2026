import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export interface FitScoreResult {
  score: number;
  occasions: string[];
  tip: string;
  missingSlots: string[];
  colorHarmony: number;
  styleCoherence: number;
  seasonalFit: number;
  lookName: string;
}

interface FitScorePiece {
  name: string;
  brand: string;
  pieceType: string;
  slotType: string;
}

interface FitScoreInput {
  pieces: FitScorePiece[];
  filledSlots: string[];
  mannequin: string;
}

function fallbackScore(filledSlots: string[]): FitScoreResult {
  const hasMissing = !filledSlots.includes('accessory');
  return {
    score: 74,
    occasions: ['Casual', 'Dia a dia'],
    tip: 'Adicione um acessório para elevar o estilo do look.',
    missingSlots: hasMissing ? ['accessory'] : [],
    colorHarmony: 75,
    styleCoherence: 73,
    seasonalFit: 74,
    lookName: 'Meu Look',
  };
}

export async function POST(req: NextRequest) {
  let body: FitScoreInput = { pieces: [], filledSlots: [], mannequin: '' };
  try {
    body = await req.json() as FitScoreInput;

    if (!Array.isArray(body.pieces) || body.pieces.length === 0) {
      return NextResponse.json({ error: 'No pieces provided' }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_AI_API_KEY;
    const isEnabled = process.env.GOOGLE_AI_PROVIDER_ENABLED === 'true';

    if (!isEnabled || !apiKey) {
      return NextResponse.json(fallbackScore(body.filledSlots ?? []));
    }

    const ai = new GoogleGenAI({ apiKey });
    const model = process.env.GOOGLE_AI_MODEL_TEXT || 'gemini-2.5-flash';

    const piecesDesc = body.pieces
      .map((p) => `- ${p.name}${p.brand ? ` (${p.brand})` : ''} — ${p.pieceType} [slot: ${p.slotType}]`)
      .join('\n');

    const prompt = `Você é um estilista especialista em moda. Analise o seguinte look montado no provador virtual:

Peças selecionadas:
${piecesDesc}

Slots preenchidos: ${(body.filledSlots ?? []).join(', ') || 'nenhum'}
Todos os slots disponíveis: upper (superior), lower (inferior), shoes (calçado), accessory (acessório)

Avalie o look com base em harmonia de cores, coerência de estilo e adequação à temporada atual (Brasil, inverno 2026).

Retorne apenas este JSON (sem markdown, sem texto adicional):
{
  "score": <número de 60 a 100 representando qualidade geral>,
  "occasions": [<2 a 3 ocasiões em português, ex: "Casual", "Trabalho", "Saída">],
  "tip": "<1 dica específica e útil em português para melhorar este look específico>",
  "missingSlots": [<slots faltando que melhorariam o look, ex: ["shoes"] ou []>],
  "colorHarmony": <número 55 a 100>,
  "styleCoherence": <número 55 a 100>,
  "seasonalFit": <número 55 a 100>,
  "lookName": "<nome criativo e fashion em português para este look>"
}`;

    const response = await ai.models.generateContent({
      model,
      contents: [prompt],
      config: { responseMimeType: 'application/json' },
    });

    let text = (response.text ?? '').trim();
    if (text.startsWith('```')) text = text.replace(/^```[a-z]*\n?/, '').replace(/\n?```$/, '');

    const data = JSON.parse(text) as FitScoreResult;
    return NextResponse.json(data);
  } catch (error) {
    console.error('[fit-score] error', error);
    return NextResponse.json(fallbackScore(body.filledSlots ?? []));
  }
}
