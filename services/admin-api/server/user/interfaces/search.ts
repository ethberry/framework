import {UserRole, UserStatus} from "@gemunionstudio/framework-types";
import {ISearchDto} from "@gemunionstudio/types-collection";

export interface IUserSearchDto extends ISearchDto {
  userRoles: Array<UserRole>;
  userStatus: Array<UserStatus>;
}
