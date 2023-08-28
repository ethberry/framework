import { DismantleStatus } from "@framework/types";

import { IDismantleCreateDto } from "./create";

export interface IDismantleUpdateDto extends IDismantleCreateDto {
  dismantleStatus: DismantleStatus;
}
