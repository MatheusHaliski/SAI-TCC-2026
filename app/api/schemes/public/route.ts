import { SchemesController } from '@/app/backend/controllers/SchemesController';
import { NextResponse } from 'next/server';

const schemesController = new SchemesController();

export async function GET() {
  try {
    const data = await schemesController.listPublic();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
