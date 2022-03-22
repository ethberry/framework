import { IIdBase } from "@gemunion/types-collection";

export interface IAuth extends IIdBase {
  ip: string;
  refreshToken: string;
  refreshTokenExpiresAt: number;
}
