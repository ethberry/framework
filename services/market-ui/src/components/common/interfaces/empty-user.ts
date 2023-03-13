import { IUser, UserStatus } from "@framework/types";
import { EnabledLanguages } from "@framework/constants";

import { emptyAddr } from "./empty-address";

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
  addresses: [emptyAddr],
  createdAt: date.toISOString(),
} as unknown as IUser;
