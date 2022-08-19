import { ISearchDto } from "@gemunion/types-collection";

import { CraftStatus } from "../../../../entities";

export interface ICraftSearchDto extends ISearchDto {
  craftStatus: Array<CraftStatus>;
}
