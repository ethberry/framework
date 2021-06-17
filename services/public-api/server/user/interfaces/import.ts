import {UserStatus} from "@trejgun/solo-types";

import {IUserCommonDto} from "../../common/dto";

export interface IUserImportDto extends IUserCommonDto {
  userStatus: UserStatus;
}
