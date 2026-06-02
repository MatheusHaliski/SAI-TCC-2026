import { NextResponse } from 'next/server';
import { adminDb } from '@/app/lib/firebaseAdmin';

const MONTH_NAMES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

export async function GET() {
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

    // 1. Users registered per month in 2026
    const usersPerMonth = MONTH_NAMES.map((month) => ({ month, count: 0 }));
    usersSnap.docs.forEach((doc) => {
      const createdAt = doc.data().createdAt as string | undefined;
      if (!createdAt) return;
      const date = new Date(createdAt);
      if (date.getFullYear() === 2026) {
        usersPerMonth[date.getMonth()].count++;
      }
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
