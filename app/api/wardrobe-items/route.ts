import { WardrobeController } from '@/app/backend/controllers/WardrobeController';
import { ServiceError } from '@/app/backend/services/errors';
import { NextResponse } from 'next/server';

const wardrobeController = new WardrobeController();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const data = await wardrobeController.listDiscoverable({
      query: searchParams.get('query') ?? undefined,
      brand: searchParams.get('brand') ?? undefined,
      piece_type: searchParams.get('piece_type') ?? undefined,
      gender: searchParams.get('gender') ?? undefined,
      season: searchParams.get('season') ?? undefined,
      material: searchParams.get('material') ?? undefined,
      creator: searchParams.get('creator') ?? undefined,
      rarity: searchParams.get('rarity') ?? undefined,
    });
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof ServiceError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const created = await wardrobeController.create(body);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    if (error instanceof ServiceError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}
