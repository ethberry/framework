import type { IIdDateBase } from "@gemunion/types-collection";

import type { IContract } from "../../../../entities";

export interface IWalletPayee extends IIdDateBase {
  contractId: number;
  contract?: IContract;
  account: string;
  shares: number;
}
