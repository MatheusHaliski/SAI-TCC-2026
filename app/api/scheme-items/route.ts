import { SchemeItemsController } from '@/app/backend/controllers/SchemeItemsController';
import { ServiceError } from '@/app/backend/services/errors';
import { NextResponse } from 'next/server';

const schemeItemsController = new SchemeItemsController();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const items = body.items;

    if (!Array.isArray(items)) {
      return NextResponse.json({ error: 'items must be an array' }, { status: 400 });
    }

    const normalized = items.map((item: Record<string, unknown>) => ({
      ...item,
      scheme_id: String(item.scheme_id),
      wardrobe_item_id: String(item.wardrobe_item_id),
    }));

    const data = await schemeItemsController.createMany(normalized);
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    if (error instanceof ServiceError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}
