import { SearchDto } from "@gemunion/collection";
import type { IDropSearchDto } from "@framework/types";

export class DropSearchDto extends SearchDto implements IDropSearchDto {
  public merchantId: number;
}
