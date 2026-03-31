# Firestore Collections (StylistAI)

## Root collections
- `sai-users`
- `sai-brands`
- `sai-brandLogoCatalog`
- `sai-markets`
- `sai-pieceItems`
- `sai-wardrobeItems`
- `sai-schemes`

## Subcollection
- `sai-schemes/{schemeId}/items`

## Relationship simulation via IDs
- `sai-pieceItems.brand_id -> sai-brands.brand_id`
- `sai-pieceItems.market_id -> sai-markets.market_id`
- `sai-wardrobeItems.user_id -> sai-users.user_id`
- `sai-wardrobeItems.brand_id -> sai-brands.brand_id`
- `sai-wardrobeItems.market_id -> sai-markets.market_id`
- `sai-brandLogoCatalog.brand_id -> sai-brands.brand_id`
- `sai-schemes.user_id -> sai-users.user_id`
- `sai-schemes/{schemeId}/items/{schemeItemId}.wardrobe_item_id -> sai-wardrobeItems.wardrobe_item_id`

## 3D pipeline fields on `sai-wardrobeItems`
- `model_status`: `queued_base | base_done | queued_branding | done | failed`
- `model_base_3d_url`, `model_branded_3d_url`, `model_3d_url`, `model_preview_url`
- `brand_id_selected`, `brand_id_detected`, `brand_detection_confidence`, `brand_detection_source`
- `brand_applied`, `placement_profile_id`, `branding_pass_version`

All relationship integrity is validated in the Service layer before writes.
