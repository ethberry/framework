import {IUser} from "@trejgun/solo-types";

export interface IPayload {
  user: IUser;
  [key: string]: any;
}
