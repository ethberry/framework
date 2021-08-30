import { UserStatus, IUserCommonDto } from "@gemunion/framework-types";

export interface IUserImportDto extends IUserCommonDto {
  userStatus: UserStatus;
}
