import { IIdDateBase } from "@gemunion/types-collection";

export interface IAccessList extends IIdDateBase {
  address: string;
  account: string;
  allowance: boolean;
}
