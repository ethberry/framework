import { IUserCommonDto } from "./common";
import { IPasswordDto } from "../auth/password";

export interface IUserCreateDto extends Required<IUserCommonDto>, IPasswordDto {
  captcha: string;
}
