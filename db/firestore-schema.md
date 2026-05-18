# Firestore Collections (StylistAI)

## Root collections
- `sai-users`
- `saiBrands`
- `sai-brandLogoCatalog`
- `saiMarkets`
- `saiPieceItems`
- `saiWardrobeItems`
- `saiSchemess`

- `sai-userPosts`
- `sai-outfitExports`

## Subcollection
- `saiSchemess/{schemeId}/items`

## Relationship simulation via IDs
- `saiPieceItems.brand_id -> saiBrands.brand_id`
- `saiPieceItems.market_id -> saiMarkets.market_id`
- `saiWardrobeItems.user_id -> sai-users.user_id`
- `saiWardrobeItems.brand_id -> saiBrands.brand_id`
- `saiWardrobeItems.market_id -> saiMarkets.market_id`
- `sai-brandLogoCatalog.brand_id -> saiBrands.brand_id`
- `saiSchemess.user_id -> sai-users.user_id`
- `saiSchemess/{schemeId}/items/{schemeItemId}.wardrobe_item_id -> saiWardrobeItems.wardrobe_item_id`

## 3D pipeline fields on `saiWardrobeItems`
- `model_status`: `queued_base | base_done | queued_branding | done | failed | needs_brand_review`
- `model_base_3d_url`, `model_branded_3d_url`, `model_3d_url`, `model_preview_url`
- `brand_id_selected`, `brand_id_detected`, `brand_detection_confidence`, `brand_detection_source`
- `brand_applied`, `placement_profile_id`, `branding_pass_version`
- `sai-brandLogoCatalog.detection_aliases` is required for image-first brand matching

All relationship integrity is validated in the Service layer before writes.

## Dress tester 2D collections
- `mannequin_2d`
- `wardrobe_piece_2d`
- `outfitSelections`

### 2D asset pipeline lifecycle
`wardrobe_piece_2d.asset_status`
- `draft`
- `asset_pending`
- `asset_review`
- `ready_for_tester`
- `published`

### 2D composition rules
- `wardrobe_piece_2d.render_layer` controls ordering (ascending).
- `wardrobe_piece_2d.hides_piece_types` applies category-level hiding (e.g. dress hides top + bottom).
- `wardrobe_piece_2d.conflicts_with` blocks incompatible piece IDs.


## Social publishing / export collections
- `sai-userPosts` stores publication lifecycle per outfit card (draft, ready, exported, published, failed).
- `sai-outfitExports` stores each export operation with platform + format metadata and generated asset URL.
- Recommended scheme extension fields: `is_published`, `published_platforms`, `export_count`, `last_exported_at`, `social_ready_asset_url`.
