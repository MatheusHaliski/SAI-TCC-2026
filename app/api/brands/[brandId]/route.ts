import { BrandsController } from '@/app/backend/controllers/BrandsController';
import { NextResponse } from 'next/server';

const brandsController = new BrandsController();

export async function GET(_: Request, { params }: { params: Promise<{ brandId: string }> }) {
  const { brandId } = await params;
  const brand = await brandsController.getById(String(brandId));
  if (!brand) {
    return NextResponse.json({ error: 'Brand not found.' }, { status: 404 });
  }
  return NextResponse.json(brand);
}
