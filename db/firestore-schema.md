# Firestore Collections (StylistAI)

## Root collections
- `users`
- `brands`
- `markets`
- `piece_items`
- `wardrobe_items`
- `schemes`

## Subcollection
- `schemes/{schemeId}/items`

## Relationship simulation via IDs
- `piece_items.brand_id -> brands.brand_id`
- `piece_items.market_id -> markets.market_id`
- `wardrobe_items.user_id -> users.user_id`
- `wardrobe_items.brand_id -> brands.brand_id`
- `wardrobe_items.market_id -> markets.market_id`
- `schemes.user_id -> users.user_id`
- `schemes/{schemeId}/items/{schemeItemId}.wardrobe_item_id -> wardrobe_items.wardrobe_item_id`

All relationship integrity is validated in the Service layer before writes.
