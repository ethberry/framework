import { IPasswordDto } from "@gemunion/framework-types";

export interface IRestorePasswordDto extends IPasswordDto {
  token: string;
}
