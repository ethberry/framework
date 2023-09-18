import { SearchDto } from "@gemunion/collection";
import type { IAssetPromoSearchDto } from "@framework/types";

export class AssetPromoSearchDto extends SearchDto implements IAssetPromoSearchDto {
  public merchantId: number;
}
