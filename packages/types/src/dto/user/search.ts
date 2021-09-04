import { ISearchDto } from "@gemunion/types-collection";

import { UserRole, UserStatus } from "../../entity";

export interface IUserSearchDto extends ISearchDto {
  userRoles: Array<UserRole>;
  userStatus: Array<UserStatus>;
}
