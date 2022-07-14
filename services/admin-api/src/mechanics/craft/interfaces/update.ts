import { CraftStatus } from "@framework/types";

import { IRecipeCreateDto } from "./create";

export interface IRecipeUpdateDto extends IRecipeCreateDto {
  craftStatus: CraftStatus;
}
