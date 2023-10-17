import { EnabledLanguages } from "@framework/constants";
import type { IUser } from "@framework/types";
import { UserStatus } from "@framework/types";

import { emptyAddress } from "./empty-address";

const date = new Date();

export const emptyUser = {
  password: "",
  confirm: "",
  email: "",
  displayName: "",
  language: EnabledLanguages.EN,
  imageUrl: "",
  userStatus: UserStatus.ACTIVE,
  userRoles: [],
  addresses: [emptyAddress],
  createdAt: date.toISOString(),
} as unknown as IUser;
