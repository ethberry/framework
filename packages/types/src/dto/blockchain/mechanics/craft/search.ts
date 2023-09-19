import type { ISearchDto } from "@gemunion/types-collection";

import { CraftStatus } from "../../../../entities";

export interface ICraftSearchDto extends ISearchDto {
  templateId: number;
  contractId: number;
  craftStatus: Array<CraftStatus>;
}
