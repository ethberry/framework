import { IUserCommonDto } from "./common";
import { IPasswordDto } from "../auth/password";

export interface IUserCreateDto extends IUserCommonDto, IPasswordDto {
  captcha: string;
}
