import { SearchDto } from "@ethberry/collection";
import type { IPromoSearchDto } from "@framework/types";

export class PromoSearchDto extends SearchDto implements IPromoSearchDto {
  public merchantId: number;
}
