import { AccessControlRoleType } from "@framework/types";

import { IAccessControlSearchDto } from "./search";

export interface IAccessControlCheckDto extends IAccessControlSearchDto {
  role: AccessControlRoleType;
}
