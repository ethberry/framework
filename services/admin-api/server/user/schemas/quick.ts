import {IUserQuickDto} from "../interfaces";
import {ProfileUpdateSchema} from "../../profile/schemas";

export class UserQuickSchema extends ProfileUpdateSchema implements IUserQuickDto {
  public comment = "";
}
