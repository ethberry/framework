import { IPaginationDto } from "@gemunion/types-collection";

import { Erc721AirdropStatus } from "../../../entities";

export interface IErc721AirdropSearchDto extends IPaginationDto {
  owner: string;
  airdropStatus: Array<Erc721AirdropStatus>;
  erc721TemplateIds: Array<number>;
}
