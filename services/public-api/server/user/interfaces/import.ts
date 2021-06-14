import {UserStatus} from "@trejgun/solo-types";

import {IUserCommonDto} from "../../common/schemas";

export interface IUserImportDto extends IUserCommonDto {
  userStatus: UserStatus;
}
