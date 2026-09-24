import { SchemesService } from '@/app/backend/services/SchemesService';
import { CreateSchemeInput, SchemeVisibility } from '@/app/backend/types/entities';

export class SchemesController {
  constructor(private readonly schemesService = new SchemesService()) {}

  async create(body: CreateSchemeInput) {
    if (body.creation_mode === 'ai') {
      return this.schemesService.createAiScheme(body);
    }

    return this.schemesService.createManualScheme(body);
  }

  async listPublic() {
    return this.schemesService.listPublicSchemes();
  }


  async listByUser(userId: string) {
    return this.schemesService.listSchemesByUser(userId);
  }

  async getById(schemeId: string) {
    return this.schemesService.getSchemeDetails(schemeId);
  }

  async getByIdForViewer(schemeId: string, viewerId?: string | null) {
    return this.schemesService.getSchemeDetailsForViewer(schemeId, viewerId);
  }

  async updateVisibility(schemeId: string, userId: string, visibility: SchemeVisibility) {
    return this.schemesService.updateSchemeVisibility(schemeId, userId, visibility);
  }
}
