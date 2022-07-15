import { CraftStatus } from "@framework/types";

import { ICraftCreateDto } from "./create";

export interface ICraftUpdateDto extends ICraftCreateDto {
  craftStatus: CraftStatus;
}
