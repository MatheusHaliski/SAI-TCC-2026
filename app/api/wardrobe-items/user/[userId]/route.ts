import { WardrobeController } from '@/app/backend/controllers/WardrobeController';
import { NextResponse } from 'next/server';

const wardrobeController = new WardrobeController();

export async function GET(_: Request, { params }: { params: Promise<{ userId: string }> }) {
  try {
    const { userId } = await params;
    const data = await wardrobeController.listByUser(userId);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
