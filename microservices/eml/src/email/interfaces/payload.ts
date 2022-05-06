import { IOtp, IUser } from "@framework/types";

export interface IPayload {
  user: IUser;
  otp: IOtp;
  baseUrl: string;
  [key: string]: any;
}
