import type { IIdDateBase } from "@ethberry/types-collection";

export interface IAccessList extends IIdDateBase {
  address: string;
  account: string;
  allowance: boolean;
}
