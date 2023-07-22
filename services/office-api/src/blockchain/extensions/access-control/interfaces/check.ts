import { AccessControlRoleType } from "@framework/types";

export interface IAccessControlCheck {
  address: string;
  account: string;
  role: AccessControlRoleType;
}
