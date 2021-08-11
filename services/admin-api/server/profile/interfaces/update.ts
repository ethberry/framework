import { IUserCommonDto } from "../../common/dto";

export interface IProfileUpdateDto extends IUserCommonDto {
  password: string;
  confirm: string;
}
