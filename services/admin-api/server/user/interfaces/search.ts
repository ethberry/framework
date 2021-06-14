import {UserRole, UserStatus} from "@trejgun/solo-types";
import {ISearchDto} from "@trejgun/types-collection";

export interface IUserSearchDto extends ISearchDto {
  userRoles: Array<UserRole>;
  userStatus: Array<UserStatus>;
}
