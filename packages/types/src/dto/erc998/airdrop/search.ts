import { IPaginationDto } from "@gemunion/types-collection";

import { Erc998AirdropStatus } from "../../../entities";

export interface IErc998AirdropSearchDto extends IPaginationDto {
  query: string;
  airdropStatus: Array<Erc998AirdropStatus>;
  erc998TemplateIds: Array<number>;
}
