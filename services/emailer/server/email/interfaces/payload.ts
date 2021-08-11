import {IUser} from "@gemunionstudio/solo-types";

export interface IPayload {
  user: IUser;
  [key: string]: any;
}
