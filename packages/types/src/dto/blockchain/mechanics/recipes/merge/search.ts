import type { ISearchDto } from "@gemunion/types-collection";

import { MergeStatus } from "../../../../../entities";

export interface IMergeSearchDto extends ISearchDto {
  templateId: number;
  contractId: number;
  mergeStatus: Array<MergeStatus>;
}
