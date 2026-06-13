import { NextRequest, NextResponse } from 'next/server';

import { COLLECTIONS } from '@/app/lib/collections';
import { getAdminFirestore } from '@/app/lib/firebaseAdmin';

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId')?.trim();
    const db = getAdminFirestore();

    let query = db.collection(COLLECTIONS.BRAND_FEED_POSTS).orderBy('createdAt', 'desc').limit(30);

    if (userId) {
      query = db.collection(COLLECTIONS.BRAND_FEED_POSTS).where('user_id', '==', userId).orderBy('createdAt', 'desc').limit(30) as unknown as typeof query;
    }

    const snapshot = await query.get();
    const now = new Date().toISOString();

    const posts = snapshot.docs
      .map((doc) => {
        const data = doc.data() as {
          featured_until?: string | null;
          featuredUntil?: string | null;
          [key: string]: unknown;
        };

        return {
          id: doc.id,
          ...data,
        };
      })
      .filter((post: { featured_until?: string | null; featuredUntil?: string | null; [key: string]: unknown }) => {
        const featuredUntil = post.featured_until ?? post.featuredUntil ?? null;
        if (!featuredUntil) return true;
        return featuredUntil > now;
      });

    return NextResponse.json({ ok: true, posts });
  } catch (error) {
    console.error('[brand-feed] GET failed', error);
    return NextResponse.json({ ok: false, posts: [] }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      userId?: string;
      title?: string;
      body?: string;
      imageUrl?: string | null;
      tag?: string | null;
      featuredUntil?: string | null;
      isOfficial?: boolean;
    };

    const userId = body.userId?.trim();
    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const db = getAdminFirestore();
    const now = new Date().toISOString();

    const post = {
      user_id: userId,
      title: body.title?.trim() || 'Post oficial Fashion AI',
      body: body.body?.trim() || 'Conteúdo destacado no feed oficial.',
      image_url: body.imageUrl ?? null,
      tag: body.tag ?? 'official',
      featured_until: body.featuredUntil ?? null,
      is_official: Boolean(body.isOfficial ?? true),
      createdAt: now,
      updatedAt: now,
    };

    const ref = await db.collection(COLLECTIONS.BRAND_FEED_POSTS).add(post);

    return NextResponse.json({ ok: true, post: { id: ref.id, ...post } });
  } catch (error) {
    console.error('[brand-feed] POST failed', error);
    return NextResponse.json({ ok: false, error: 'Unable to save feed post.' }, { status: 500 });
  }
}
