import { SearchDto } from "@gemunion/collection";
import type { IPromoSearchDto } from "@framework/types";

export class PromoSearchDto extends SearchDto implements IPromoSearchDto {
  public merchantId: number;
}
