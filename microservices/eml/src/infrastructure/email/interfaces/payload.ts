import type { IOtp } from "@framework/types";
import { IUser } from "@framework/types";

export interface IPayload {
  user: IUser;
  otp: IOtp;
  baseUrl: string;
  [key: string]: any;
}
