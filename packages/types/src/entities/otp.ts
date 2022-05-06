import { IUuidBase } from "@gemunion/types-collection";

import { IUser } from "./user";

export enum OtpType {
  EMAIL = "EMAIL",
  PASSWORD = "PASSWORD",
}

export interface IOtp extends IUuidBase {
  otpType: OtpType;
  data: Record<string, string>;
  userId: number;
  user?: IUser;
}
