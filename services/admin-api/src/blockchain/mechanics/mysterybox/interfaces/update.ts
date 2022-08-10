import { MysteryboxStatus } from "@framework/types";

import { IMysteryboxCreateDto } from "./create";

export interface IMysteryboxUpdateDto extends IMysteryboxCreateDto {
  mysteryboxStatus: MysteryboxStatus;
}
