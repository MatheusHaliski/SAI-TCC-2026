import { SchemeItemsController } from '@/app/backend/controllers/SchemeItemsController';
import { ServiceError } from '@/app/backend/services/errors';
import { NextResponse } from 'next/server';

const schemeItemsController = new SchemeItemsController();

/**
 * Closet Inteligente — returns, for each wardrobe item id, how many schemes use
 * it and when it was last used. Powers the "usada em N looks" / "esquecidas"
 * insights in the wardrobe view.
 *
 * Body: { wardrobeItemIds: string[] }
 * Response: { usage: Record<string, { count: number; lastUsedAt: string | null }> }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const wardrobeItemIds = body?.wardrobeItemIds;

    if (!Array.isArray(wardrobeItemIds)) {
      return NextResponse.json({ error: 'wardrobeItemIds must be an array' }, { status: 400 });
    }

    const usage = await schemeItemsController.getWardrobeUsage(
      wardrobeItemIds.map((id: unknown) => String(id)),
    );
    return NextResponse.json({ usage });
  } catch (error) {
    if (error instanceof ServiceError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}
