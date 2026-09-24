import { getAdminFirestore } from '@/app/lib/firebaseAdmin';
import { COLLECTIONS } from '@/app/lib/collections';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId')?.trim()
    || request.headers.get('x-user-id') || '';

  if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 });

  const db = getAdminFirestore();
  const snap = await db
    .collection(COLLECTIONS.NOTIFICATIONS)
    .where('user_id', '==', userId)
    .orderBy('createdAt', 'desc')
    .limit(50)
    .get();

  type NotificationDoc = { is_read?: boolean; [key: string]: unknown };
  const notifications = snap.docs.map((doc: { id: string; data(): NotificationDoc }) => ({ notification_id: doc.id, ...doc.data() }));
  const unread_count = notifications.filter((n: NotificationDoc) => !n.is_read).length;

  return NextResponse.json({ notifications, unread_count });
}

export async function PATCH(request: NextRequest) {
  try {
    const body = (await request.json()) as { userId?: string; notificationIds?: string[]; markAll?: boolean };
    const { userId, notificationIds, markAll } = body;

    if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 });

    const db = getAdminFirestore();
    const now = new Date().toISOString();

    if (markAll) {
      const snap = await db
        .collection(COLLECTIONS.NOTIFICATIONS)
        .where('user_id', '==', userId)
        .where('is_read', '==', false)
        .get();

      const batch = db.batch();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      snap.docs.forEach((doc: any) => batch.update(doc.ref, { is_read: true, readAt: now }));
      await batch.commit();
      return NextResponse.json({ ok: true, marked: snap.size });
    }

    if (Array.isArray(notificationIds) && notificationIds.length > 0) {
      const batch = db.batch();
      notificationIds.forEach((id) => {
        const ref = db.collection(COLLECTIONS.NOTIFICATIONS).doc(id);
        batch.update(ref, { is_read: true, readAt: now });
      });
      await batch.commit();
      return NextResponse.json({ ok: true, marked: notificationIds.length });
    }

    return NextResponse.json({ error: 'Provide notificationIds or markAll=true' }, { status: 400 });
  } catch {
    return NextResponse.json({ error: 'Unable to update notifications' }, { status: 500 });
  }
}
