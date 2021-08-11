import {UserRole, UserStatus} from "@gemunionstudio/solo-types";
import {ISearchDto} from "@gemunionstudio/types-collection";

export interface IUserSearchDto extends ISearchDto {
  userRoles: Array<UserRole>;
  userStatus: Array<UserStatus>;
}
