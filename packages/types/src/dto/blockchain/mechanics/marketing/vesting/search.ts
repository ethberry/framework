import type { ISearchDto } from "@ethberry/types-collection";

import { VestingBoxStatus } from "../../../../../entities";

export interface IVestingBoxSearchDto extends ISearchDto {
  vestingBoxStatus: Array<VestingBoxStatus>;
  contractIds: Array<number>;
  chainId: bigint;
  merchantId: number;
}
