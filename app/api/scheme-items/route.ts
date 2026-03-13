import { SchemeItemsController } from '@/app/backend/controllers/SchemeItemsController';
import { NextResponse } from 'next/server';

const schemeItemsController = new SchemeItemsController();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const items = body.items;

    if (!Array.isArray(items)) {
      return NextResponse.json({ error: 'items must be an array' }, { status: 400 });
    }

    const data = await schemeItemsController.createMany(items);
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
