import { UserRole, UserStatus } from "@framework/types";

import type { IProfileUpdateDto } from "../../profile/interfaces";

export interface IUserUpdateDto extends IProfileUpdateDto {
  userStatus: UserStatus;
  userRoles: Array<UserRole>;
  comment: string;
}
