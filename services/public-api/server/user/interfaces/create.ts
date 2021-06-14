import {IUserCommonDto} from "../../common/schemas";
import {IPasswordDto} from "../../auth/interfaces";

export interface IUserCreateDto extends IUserCommonDto, IPasswordDto {
  captcha: string;
}
