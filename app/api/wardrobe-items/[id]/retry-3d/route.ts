import { WardrobeController } from '@/app/backend/controllers/WardrobeController';
import { ServiceError } from '@/app/backend/services/errors';
import { NextResponse } from 'next/server';

const wardrobeController = new WardrobeController();

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const result = await wardrobeController.retry3D(id);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    if (error instanceof ServiceError) {
      return NextResponse.json({ ok: false, error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ ok: false, error: 'Unexpected error' }, { status: 500 });
  }
}
