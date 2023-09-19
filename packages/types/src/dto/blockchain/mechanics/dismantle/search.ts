import type { ISearchDto } from "@gemunion/types-collection";

import { DismantleStatus } from "../../../../entities";

export interface IDismantleSearchDto extends ISearchDto {
  templateId: number;
  dismantleStatus: Array<DismantleStatus>;
}
