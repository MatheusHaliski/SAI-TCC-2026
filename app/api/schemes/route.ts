import { SchemesController } from '@/app/backend/controllers/SchemesController';
import { ServiceError } from '@/app/backend/services/errors';
import { NextResponse } from 'next/server';

const schemesController = new SchemesController();

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.user_id || !body.title || !body.style || !body.occasion || !body.visibility) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const normalized = {
      ...body,
      user_id: String(body.user_id),
      items: Array.isArray(body.items)
        ? body.items.map((item: Record<string, unknown>) => ({
            ...item,
            wardrobe_item_id: String(item.wardrobe_item_id),
          }))
        : [],
    };

    const data = await schemesController.create(normalized);
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    if (error instanceof ServiceError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}
