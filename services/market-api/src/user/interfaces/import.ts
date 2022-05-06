import { IUserCommonDto, UserRole, UserStatus } from "@framework/types";

export interface IUserImportDto extends IUserCommonDto {
  userStatus: UserStatus;
  userRoles: Array<UserRole>;
  sub: string;
}
