import { UserRole, UserStatus } from "@gemunion/framework-types";
import { ISearchDto } from "@gemunion/types-collection";

export interface IUserSearchDto extends ISearchDto {
  userRoles: Array<UserRole>;
  userStatus: Array<UserStatus>;
}
