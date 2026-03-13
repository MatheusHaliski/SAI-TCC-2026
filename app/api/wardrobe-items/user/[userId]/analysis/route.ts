import { WardrobeController } from '@/app/backend/controllers/WardrobeController';
import { NextResponse } from 'next/server';

const wardrobeController = new WardrobeController();

export async function GET(_: Request, { params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  const id = Number(userId);

  if (Number.isNaN(id)) {
    return NextResponse.json({ error: 'Invalid userId' }, { status: 400 });
  }

  const data = await wardrobeController.analysisByUser(id);
  return NextResponse.json(data);
}
