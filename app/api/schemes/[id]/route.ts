import { SchemesController } from '@/app/backend/controllers/SchemesController';
import { ServiceError } from '@/app/backend/services/errors';
import { SchemeVisibility } from '@/app/backend/types/entities';
import { NextRequest, NextResponse } from 'next/server';

const schemesController = new SchemesController();

// RF28: visibility is enforced here. `?viewerId=` identifies the requester so
// that owners and followers can reach restricted schemes; everyone else only
// sees public ones. A denied or missing scheme both return 404 (no leak).
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const viewerId = request.nextUrl.searchParams.get('viewerId');
  const data = await schemesController.getByIdForViewer(String(id), viewerId);
  if (!data) {
    return NextResponse.json({ error: 'Scheme not found' }, { status: 404 });
  }

  return NextResponse.json(data);
}

// RF28: owner-only visibility change. Body: { userId, visibility }
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const userId = String(body?.userId ?? '').trim();
    const visibility = body?.visibility as SchemeVisibility;

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const result = await schemesController.updateVisibility(String(id), userId, visibility);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof ServiceError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}
