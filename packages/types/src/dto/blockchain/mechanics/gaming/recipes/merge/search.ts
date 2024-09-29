import type { ISearchDto } from "@ethberry/types-collection";

import { MergeStatus } from "../../../../../../entities";

export interface IMergeSearchDto extends ISearchDto {
  templateId: number;
  contractId: number;
  mergeStatus: Array<MergeStatus>;
}
