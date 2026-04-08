import { OutfitCardAiService } from '@/app/backend/services/OutfitCardAiService';
import { ServiceError } from '@/app/backend/services/errors';
import { OutfitInterpretResponse, OutfitInterpretationInput } from '@/app/backend/types/outfit-card-ai';
import { NextRequest, NextResponse } from 'next/server';

const service = new OutfitCardAiService();

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as OutfitInterpretationInput;
    const data = await service.interpret(body);
    const response: OutfitInterpretResponse = { success: true, data };
    return NextResponse.json(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Não foi possível interpretar o look.';

    if (error instanceof ServiceError) {
      const response: OutfitInterpretResponse = { success: false, error: message };
      return NextResponse.json(response, { status: error.statusCode });
    }

    console.error('api.outfit-card.interpret', error);
    const response: OutfitInterpretResponse = { success: false, error: message };
    return NextResponse.json(response, { status: 500 });
  }
}
