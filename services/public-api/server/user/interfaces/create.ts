import { IUserCommonDto } from "../../common/dto";
import { IPasswordDto } from "../../auth/interfaces";

export interface IUserCreateDto extends IUserCommonDto, IPasswordDto {
  captcha: string;
}
