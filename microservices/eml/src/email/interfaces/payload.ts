import { IToken, IUser } from "@gemunion/framework-types";

export interface IPayload {
  user: IUser;
  token: IToken;
  baseUrl: string;
  [key: string]: any;
}
