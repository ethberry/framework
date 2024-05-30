import { MergeStatus } from "@framework/types";

import type { IMergeCreateDto } from "./create";

export interface IMergeUpdateDto extends IMergeCreateDto {
  mergeStatus: MergeStatus;
}
