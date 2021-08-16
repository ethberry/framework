import { UserStatus } from "@gemunion/framework-types";

import { IUserCommonDto } from "../../common/dto";

export interface IUserImportDto extends IUserCommonDto {
  userStatus: UserStatus;
}
