# CJ → local field mapping (as‑sent)

| CJ field / source                                | Local column / JSON path           | Notes                                                                       |
|--------------------------------------------------|------------------------------------|-----------------------------------------------------------------------------|
| pid                                              | cj_product_id                      | Raw CJ product id                                                           |
| productName                                      | cj_product_name                    | CJ returns JSON array string; stored as‑is                                  |
| productNameEn                                    | cj_product_name_en                 |                                                                             |
| productSku                                       | cj_sku                             |                                                                             |
| spu                                              | cj_spu                             |                                                                             |
| categoryId                                       | cj_category_id                     | Third‑level category                                                        |
| categoryName                                     | cj_category_name                   |                                                                             |
| productType                                      | cj_product_type                    | ORDINARY_PRODUCT / SERVICE_PRODUCT / PACKAGING_PRODUCT / SUPPLIER_*        |
| productUnit                                      | cj_product_unit                    |                                                                             |
| productWeight                                    | cj_product_weight                  | Grams                                                                        |
| description                                      | cj_description                     | Raw HTML                                                                    |
| materialName / materialNameEn / materialKey      | cj_material                        | Stored as received (array/string)                                           |
| packingName / packingNameEn / packingKey         | cj_packing                         | Stored as received                                                          |
| productKey / productKeyEn                        | cj_product_key                     |                                                                             |
| productPro / productProEn / productProSet        | cj_logistics_props                 | Logistics attributes                                                        |
| sellPrice                                        | cj_sell_price                      | Raw CJ price; also copied to costPrice on **create**                        |
| nowPrice                                         | cj_now_price                       |                                                                             |
| discountPrice                                    | cj_discount_price                  |                                                                             |
| suggestSellPrice                                 | cj_suggest_sell_price              |                                                                             |
| currency                                         | cj_currency                        | Stored raw (e.g., USD); no FX conversion yet                                |
| addMarkStatus / isFreeShipping                   | cj_is_free_shipping                | 0/1 or boolean as sent                                                      |
| verifiedWarehouse                                | cj_verified_warehouse              | 1=verified, 2=unverified                                                    |
| warehouseInventoryNum / totalVerifiedInventory   | cj_inventory_totals                | Summary figures when provided                                               |
| videoList                                        | cj_video                           | Array of IDs/URLs                                                           |
| supplierName / supplierId                        | supplier / supplierSku             | supplier set to `cj`                                                        |

## Variants
| CJ variant field | Local variant field                | Notes                                             |
|------------------|-------------------------------------|---------------------------------------------------|
| vid              | variants[].vid                      |                                                   |
| variantSku       | variants[].sku                      |                                                   |
| variantNameEn    | variants[].name                     |                                                   |
| variantWeight    | variants[].weight                   | Grams                                             |
| variantLength/Width/Height/Volume | variants[].dimensions | Millimeters / mm³                                  |
| variantSellPrice | variants[].sellPrice                |                                                   |
| variantSugSellPrice | variants[].sugSellPrice          |                                                   |
| variantStandard  | variants[].standard                 | Stored as string                                  |
| combineVariants / combineNum | variants[].combine*     | Stored as sent                                    |

## Stock (per warehouse)
From stock endpoints we keep, per variant:
- countryCode
- warehouseId / areaId
- warehouseName / areaEn
- verified (1/2)
- totalInventory / cjInventory / factoryInventory

## Pricing rules (current)
- On create: costPrice = cj_sell_price; price is left at its existing/default value.
- On update: price is **not** overwritten; cj_* fields and costPrice are refreshed from CJ.

If CJ adds new fields, add a row here and a matching `cj_*` column so nothing is lost.***
