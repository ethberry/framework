import { CraftStatus } from "@framework/types";

import type { ICraftCreateDto } from "./create";

export interface ICraftUpdateDto extends ICraftCreateDto {
  craftStatus: CraftStatus;
}
