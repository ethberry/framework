import { IIdDateBase } from "@gemunion/types-collection";

export interface IAuth extends IIdDateBase {
  ip: string;
  refreshToken: string;
  refreshTokenExpiresAt: number;
}
