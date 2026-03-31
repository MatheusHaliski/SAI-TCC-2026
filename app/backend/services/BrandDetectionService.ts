import { BrandDetectionSource } from '@/app/backend/types/entities';
import { BrandsRepository } from '@/app/backend/repositories/BrandsRepository';

export interface BrandDetectionResult {
  brand_id_detected: string | null;
  brand_detection_confidence: number | null;
  brand_detection_source: BrandDetectionSource | null;
}

export class BrandDetectionService {
  constructor(private readonly brandsRepository = new BrandsRepository()) {}

  async detect(input: {
    selectedBrandId: string;
    name: string;
    imageUrl: string;
  }): Promise<BrandDetectionResult> {
    const selectedBrandId = input.selectedBrandId.trim();
    if (selectedBrandId && selectedBrandId !== 'default') {
      return {
        brand_id_detected: selectedBrandId,
        brand_detection_confidence: 0.99,
        brand_detection_source: 'manual',
      };
    }

    const activeBrands = await this.brandsRepository.listActive();
    const normalizedName = `${input.name} ${input.imageUrl}`.toLowerCase();
    const matched = activeBrands.find((brand) => normalizedName.includes(brand.name.toLowerCase()));

    if (!matched) {
      return {
        brand_id_detected: null,
        brand_detection_confidence: 0.35,
        brand_detection_source: 'hybrid',
      };
    }

    return {
      brand_id_detected: matched.brand_id,
      brand_detection_confidence: 0.7,
      brand_detection_source: 'hybrid',
    };
  }
}
