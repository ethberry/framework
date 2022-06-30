import { IPaginationDto } from "@gemunion/types-collection";

import { AirdropStatus } from "../../../entities";

export interface IAirdropSearchDto extends IPaginationDto {
  account: string;
  airdropStatus: Array<AirdropStatus>;
  templateIds: Array<number>;
}
