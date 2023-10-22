import { MergeStatus } from "@framework/types";

import { IMergeCreateDto } from "./create";

export interface IMergeUpdateDto extends IMergeCreateDto {
  mergeStatus: MergeStatus;
}
