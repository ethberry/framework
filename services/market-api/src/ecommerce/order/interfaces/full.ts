import { IUserImportDto } from "../../../infrastructure/user/interfaces";
import { IAddressCreateDto } from "../../address/interfaces";

export interface IOrderFullDto {
  user: IUserImportDto;
  addresses: Array<IAddressCreateDto>;

  save: boolean;
}
