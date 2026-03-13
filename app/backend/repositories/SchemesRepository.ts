import { CreateSchemeInput, Scheme, SchemeWithItems } from '@/app/backend/types/entities';
import { BaseRepository } from './BaseRepository';

export class SchemesRepository extends BaseRepository {
  async create(input: CreateSchemeInput): Promise<Scheme> {
    if (this.useMysql) {
      const { getMysqlPool } = await import('@/app/lib/db/mysql');
      const pool = getMysqlPool();
      const [result] = await pool!.query(
        `INSERT INTO schemes (user_id, title, description, creation_mode, style, occasion, visibility, community_indexed, cover_image_url, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          input.user_id,
          input.title,
          input.description ?? null,
          input.creation_mode,
          input.style,
          input.occasion,
          input.visibility,
          input.community_indexed ?? (input.visibility === 'public'),
          input.cover_image_url ?? null,
        ],
      );

      const insertedId = Number((result as { insertId: number }).insertId);
      const [rows] = await pool!.query('SELECT * FROM schemes WHERE scheme_id = ? LIMIT 1', [insertedId]);
      return (rows as Scheme[])[0];
    }

    const { schemes } = this.getMockData();
    const nextId = Math.max(...schemes.map((item) => item.scheme_id), 0) + 1;
    const now = new Date().toISOString();
    const scheme: Scheme = {
      scheme_id: nextId,
      user_id: input.user_id,
      title: input.title,
      description: input.description ?? null,
      creation_mode: input.creation_mode,
      style: input.style,
      occasion: input.occasion,
      visibility: input.visibility,
      community_indexed: input.community_indexed ?? input.visibility === 'public',
      cover_image_url: input.cover_image_url ?? null,
      created_at: now,
      updated_at: now,
    };
    schemes.push(scheme);
    return scheme;
  }

  async findPublic(): Promise<Scheme[]> {
    if (this.useMysql) {
      const { getMysqlPool } = await import('@/app/lib/db/mysql');
      const pool = getMysqlPool();
      const [rows] = await pool!.query(`SELECT * FROM schemes WHERE visibility = 'public' ORDER BY created_at DESC`);
      return rows as Scheme[];
    }

    return this.getMockData().schemes.filter((scheme) => scheme.visibility === 'public');
  }

  async findByIdWithItems(schemeId: number): Promise<SchemeWithItems | null> {
    if (this.useMysql) {
      const { getMysqlPool } = await import('@/app/lib/db/mysql');
      const pool = getMysqlPool();
      const [schemeRows] = await pool!.query(
        `SELECT s.*, u.name AS author
         FROM schemes s
         INNER JOIN users u ON u.user_id = s.user_id
         WHERE s.scheme_id = ?
         LIMIT 1`,
        [schemeId],
      );
      const schemeResult = (schemeRows as Array<Scheme & { author: string }>)[0];
      if (!schemeResult) return null;

      const [itemRows] = await pool!.query(
        `SELECT si.*, wi.name AS wardrobe_name, wi.image_url
         FROM scheme_items si
         INNER JOIN wardrobe_items wi ON wi.wardrobe_item_id = si.wardrobe_item_id
         WHERE si.scheme_id = ?
         ORDER BY si.sort_order`,
        [schemeId],
      );

      return {
        scheme: schemeResult,
        items: itemRows as SchemeWithItems['items'],
        author: schemeResult.author,
      };
    }

    const { schemes, schemeItems, wardrobeItems, users } = this.getMockData();
    const scheme = schemes.find((item) => item.scheme_id === schemeId);
    if (!scheme) return null;

    const items = schemeItems
      .filter((item) => item.scheme_id === schemeId)
      .map((item) => {
        const wardrobe = wardrobeItems.find((wardrobeItem) => wardrobeItem.wardrobe_item_id === item.wardrobe_item_id);
        return {
          ...item,
          wardrobe_name: wardrobe?.name ?? 'Unknown',
          image_url: wardrobe?.image_url ?? '',
        };
      });

    return {
      scheme,
      items,
      author: users.find((user) => user.user_id === scheme.user_id)?.name ?? 'Unknown',
    };
  }
}
