import type { IIdDateBase } from "@gemunion/types-collection";

export interface IWalletPayee extends IIdDateBase {
  account: string;
  shares: number;
}
