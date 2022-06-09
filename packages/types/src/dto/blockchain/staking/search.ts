import { ISearchDto } from "@gemunion/types-collection";

import { StakingStatus } from "../../../entities";

export interface IStakingSearchDto extends ISearchDto {
  stakingStatus: Array<StakingStatus>;
}
