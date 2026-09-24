import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { classifyGenderHeuristic, GenderClassification, isGenderPattern } from '@/app/lib/gender-classify';

// RF21 — returns an editable gender-pattern suggestion for a piece. Uses the
// Google AI provider when configured; otherwise the deterministic heuristic.
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const name = String(body?.name ?? '');
  const pieceType = String(body?.pieceType ?? '');
  const styleTags = Array.isArray(body?.styleTags) ? body.styleTags.map(String) : [];

  const heuristic = classifyGenderHeuristic({ name, pieceType, styleTags });

  try {
    const apiKey = process.env.GOOGLE_AI_API_KEY;
    const isEnabled = process.env.GOOGLE_AI_PROVIDER_ENABLED === 'true';
    if (!isEnabled || !apiKey) {
      return NextResponse.json(heuristic);
    }

    const ai = new GoogleGenAI({ apiKey });
    const model = process.env.GOOGLE_AI_MODEL_TEXT || 'gemini-2.5-flash';
    const prompt = `Classifique o padrão de gênero típico desta peça de roupa em uma única palavra: "masculino", "feminino" ou "unissex".\nNome: ${name}\nTipo: ${pieceType}\nTags: ${styleTags.join(', ')}\nResponda APENAS com a palavra.`;

    const response = await ai.models.generateContent({ model, contents: prompt });
    const text = (response.text ?? '').trim().toLowerCase();
    const matched = ['masculino', 'feminino', 'unissex'].find((g) => text.includes(g));

    if (isGenderPattern(matched)) {
      const result: GenderClassification = { gender: matched, confidence: 0.85, source: 'ai' };
      return NextResponse.json(result);
    }
    return NextResponse.json(heuristic);
  } catch {
    return NextResponse.json(heuristic);
  }
}
