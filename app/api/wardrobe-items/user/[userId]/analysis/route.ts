import { WardrobeController } from '@/app/backend/controllers/WardrobeController';
import { NextResponse } from 'next/server';

const wardrobeController = new WardrobeController();

export async function GET(_: Request, { params }: { params: Promise<{ userId: string }> }) {
<<<<<<< HEAD
  try {
    const { userId } = await params;
    const data = await wardrobeController.analysisByUser(userId);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
=======
  const { userId } = await params;
  const id = Number(userId);

  if (Number.isNaN(id)) {
    return NextResponse.json({ error: 'Invalid userId' }, { status: 400 });
  }

  const data = await wardrobeController.analysisByUser(id);
  return NextResponse.json(data);
>>>>>>> 86fb19f (Refatora telas filhas e adiciona backend multilayer com APIs)
}
