import type { ISearchDto } from "@gemunion/types-collection";

import { UserRole, UserStatus } from "../../entities";

export interface IUserSearchDto extends ISearchDto {
  userRoles: Array<UserRole>;
  userStatus: Array<UserStatus>;
}
