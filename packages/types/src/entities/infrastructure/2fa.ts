import { IIdDateBase } from "@gemunion/types-collection";

import type { IUser } from "./user";

export interface I2FA extends IIdDateBase {
  secret: string;
  isActive: boolean;
  user: IUser;
  userId: number;
  endTimestamp: string;
}
