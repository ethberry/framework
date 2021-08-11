import {IUser} from "@gemunionstudio/framework-types";

export interface IPayload {
  user: IUser;
  [key: string]: any;
}
