import type { IOtp, IUser } from "@framework/types";

export interface IPayload {
  invitee: IUser;
  user: IUser;
  otp: IOtp;
  baseUrl: string;
  [key: string]: any;
}
