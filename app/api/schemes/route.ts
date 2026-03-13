import { SchemesController } from '@/app/backend/controllers/SchemesController';
import { NextResponse } from 'next/server';

const schemesController = new SchemesController();

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.user_id || !body.title || !body.style || !body.occasion || !body.visibility) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const data = await schemesController.create(body);
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
