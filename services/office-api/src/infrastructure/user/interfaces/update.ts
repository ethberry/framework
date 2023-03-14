import { UserRole, UserStatus } from "@framework/types";

import { IProfileUpdateDto } from "../../profile/interfaces";

export interface IUserUpdateDto extends IProfileUpdateDto {
  userStatus?: UserStatus;
  userRoles?: Array<UserRole>;
  comment?: string;
}
