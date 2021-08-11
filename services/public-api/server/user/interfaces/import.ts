import {UserStatus} from "@gemunionstudio/solo-types";

import {IUserCommonDto} from "../../common/dto";

export interface IUserImportDto extends IUserCommonDto {
  userStatus: UserStatus;
}
