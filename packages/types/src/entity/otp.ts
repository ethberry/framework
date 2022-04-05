import { IUuidBase } from "@gemunion/types-collection";

export enum OtpType {
  EMAIL = "EMAIL",
  PASSWORD = "PASSWORD",
}

export interface IOtp extends IUuidBase {
  otpType: OtpType;
  data: Record<string, string>;
}
