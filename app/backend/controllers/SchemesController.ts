import { SchemesService } from '@/app/backend/services/SchemesService';
import { CreateSchemeInput } from '@/app/backend/types/entities';

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

<<<<<<< HEAD
  async getById(schemeId: string) {
=======
  async getById(schemeId: number) {
>>>>>>> 86fb19f (Refatora telas filhas e adiciona backend multilayer com APIs)
    return this.schemesService.getSchemeDetails(schemeId);
  }
}
