import { UserRole, UserStatus } from "@gemunion/framework-types";

import { IProfileUpdateDto } from "../../profile/interfaces";

export interface IUserUpdateDto extends IProfileUpdateDto {
  userStatus?: UserStatus;
  userRoles?: Array<UserRole>;
  comment?: string;
}
