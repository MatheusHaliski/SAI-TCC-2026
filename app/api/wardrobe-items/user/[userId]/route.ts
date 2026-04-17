import { WardrobeController } from '@/app/backend/controllers/WardrobeController';
import { ServiceError } from '@/app/backend/services/errors';
import { NextResponse } from 'next/server';

const wardrobeController = new WardrobeController();

export async function GET(request: Request, { params }: { params: Promise<{ userId: string }> }) {
  try {
    const { searchParams } = new URL(request.url);
    const { userId } = await params;
    const data = await wardrobeController.listByUser(String(userId), {
      status: (searchParams.get('status') as 'active' | 'processing' | 'archived' | null) ?? 'active',
      piece_type: searchParams.get('piece_type') ?? undefined,
      cursorCreatedAt: searchParams.get('cursor') ?? undefined,
      limit: Number(searchParams.get('limit') ?? 24),
    });
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof ServiceError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}
