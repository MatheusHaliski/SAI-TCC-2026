import type { Timestamp } from 'firebase-admin/firestore';
import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/app/lib/firebaseAdmin';
import { readSession } from '@/app/lib/serverSession';

const MONTH_NAMES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

function toDate(value: unknown): Date | null {
  if (!value) return null;
  // Firestore Timestamp (serverTimestamp() writes this type)
  if (typeof (value as Timestamp).toDate === 'function') {
    return (value as Timestamp).toDate();
  }
  // ISO string fallback
  if (typeof value === 'string') {
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
  }
  return null;
}

export async function GET(request: NextRequest) {
  const session = readSession(request);
  if (!session?.sub) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const callerSnap = await adminDb.collection('saiUsers').doc(session.sub).get();
  const callerRole = (callerSnap.data() as { role?: string } | undefined)?.role;

  try {
    const [usersSnap, wardrobeSnap, pipelineSnap, schemesSnap, brandsSnap] = await Promise.all([
      adminDb.collection('saiUsers').get(),
      adminDb.collection('saiWardrobeItems').get(),
      adminDb.collection('saiPipelineJobs').get(),
      adminDb.collection('saiUserSavedSchemes').get(),
      adminDb.collection('saiBrands').get(),
    ]);

    const brandMap = new Map<string, string>();
    brandsSnap.docs.forEach((doc) => {
      const name = doc.data().name as string | undefined;
      brandMap.set(doc.id, name || 'Sem Nome');
    });

    const userMap = new Map<string, string>();
    usersSnap.docs.forEach((doc) => {
      const name = doc.data().name as string | undefined;
      userMap.set(doc.id, name || 'Usuário Desconhecido');
    });

    // 1. Users registered per month (all time, grouped as "MMM/YYYY")
    const usersPerMonthMap = new Map<string, number>();
    usersSnap.docs.forEach((doc) => {
      const date = toDate(doc.data().createdAt);
      if (!date || isNaN(date.getTime())) return;
      const key = `${MONTH_NAMES[date.getMonth()]}/${date.getFullYear()}`;
      usersPerMonthMap.set(key, (usersPerMonthMap.get(key) ?? 0) + 1);
    });
    // Sort chronologically
    const usersPerMonth = Array.from(usersPerMonthMap.entries())
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => {
        const [mA, yA] = a.month.split('/');
        const [mB, yB] = b.month.split('/');
        const yearDiff = Number(yA) - Number(yB);
        if (yearDiff !== 0) return yearDiff;
        return MONTH_NAMES.indexOf(mA) - MONTH_NAMES.indexOf(mB);
      });

    // 2. Clothing pieces created per brand (wardrobe items)
    const piecesByBrandMap = new Map<string, number>();
    wardrobeSnap.docs.forEach((doc) => {
      const brandId = doc.data().brand_id as string | undefined;
      const brandName = brandId ? (brandMap.get(brandId) ?? 'Sem Marca') : 'Sem Marca';
      piecesByBrandMap.set(brandName, (piecesByBrandMap.get(brandName) ?? 0) + 1);
    });
    const piecesByBrand = Array.from(piecesByBrandMap.entries())
      .map(([brand, count]) => ({ brand, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 15);

    // 3. 3D pipelines generated per piece name
    const wardrobeItemNameMap = new Map<string, string>();
    wardrobeSnap.docs.forEach((doc) => {
      const name = doc.data().name as string | undefined;
      wardrobeItemNameMap.set(doc.id, name || 'Sem Nome');
    });

    const pipelinesByPieceMap = new Map<string, number>();
    pipelineSnap.docs.forEach((doc) => {
      const wardrobeItemId = doc.data().wardrobe_item_id as string | undefined;
      const pieceName = wardrobeItemId
        ? (wardrobeItemNameMap.get(wardrobeItemId) ?? 'Peça Desconhecida')
        : 'Peça Desconhecida';
      pipelinesByPieceMap.set(pieceName, (pipelinesByPieceMap.get(pieceName) ?? 0) + 1);
    });
    const pipelinesByPiece = Array.from(pipelinesByPieceMap.entries())
      .map(([piece, count]) => ({ piece, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 15);

    // 4. Outfit schemes per user
    const schemesByUserMap = new Map<string, number>();
    schemesSnap.docs.forEach((doc) => {
      const userId = doc.data().user_id as string | undefined;
      const userName = userId ? (userMap.get(userId) ?? 'Desconhecido') : 'Desconhecido';
      schemesByUserMap.set(userName, (schemesByUserMap.get(userName) ?? 0) + 1);
    });
    const schemesByUser = Array.from(schemesByUserMap.entries())
      .map(([user, count]) => ({ user, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 15);

    // 5. Clothing pieces per user
    const piecesByUserMap = new Map<string, number>();
    wardrobeSnap.docs.forEach((doc) => {
      const data = doc.data();
      const userId = (data.userId ?? data.user_id) as string | undefined;
      const userName = userId ? (userMap.get(userId) ?? 'Desconhecido') : 'Desconhecido';
      piecesByUserMap.set(userName, (piecesByUserMap.get(userName) ?? 0) + 1);
    });
    const piecesByUser = Array.from(piecesByUserMap.entries())
      .map(([user, count]) => ({ user, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 15);

    return NextResponse.json({
      usersPerMonth,
      piecesByBrand,
      pipelinesByPiece,
      schemesByUser,
      piecesByUser,
      meta: {
        totalUsers: usersSnap.size,
        totalPieces: wardrobeSnap.size,
        totalPipelines: pipelineSnap.size,
        totalSchemes: schemesSnap.size,
        totalBrands: brandsSnap.size,
      },
    });
  } catch (error) {
    console.error('[dashboard/stats] error:', error);
    return NextResponse.json({ error: 'Falha ao buscar estatísticas' }, { status: 500 });
  }
}
