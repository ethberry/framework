import type { IIdDateBase } from "@ethberry/types-collection";

export interface IAuth extends IIdDateBase {
  ip: string;
  refreshToken: string;
  refreshTokenExpiresAt: number;
}
