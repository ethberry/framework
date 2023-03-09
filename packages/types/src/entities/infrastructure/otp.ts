import type { IUuidDateBase } from "@gemunion/types-collection";

import type { IUser } from "./user";

export enum OtpType {
  EMAIL = "EMAIL",
  PASSWORD = "PASSWORD",
}

export interface IOtp extends IUuidDateBase {
  otpType: OtpType;
  data: Record<string, string>;
  userId: number;
  user?: IUser;
}
