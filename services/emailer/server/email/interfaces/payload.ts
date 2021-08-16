import { IUser } from "@gemunion/framework-types";

export interface IPayload {
  user: IUser;
  [key: string]: any;
}
