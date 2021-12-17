import { v4 } from "uuid";

import { IMerchant, IToken, IUser, TokenType } from "@gemunion/framework-types";
import { EnabledLanguages } from "@gemunion/framework-constants";

export const fakeUser = {
  password: "",
  confirm: "",
  email: "trejgun@gmail.com",
  firstName: "Trej",
  lastName: "Gun",
  phoneNumber: "+62 (812) 3919-8760",
  language: EnabledLanguages.EN,
  createdAt: new Date().toISOString(),
} as unknown as IUser;

export const fakeToken = {
  uuid: v4(),
  tokenType: TokenType.EMAIL,
} as unknown as IToken;

export const fakeMerchant = {
  title: "Cat's Shop",
  description: "qwerty",
  phoneNumber: "+62 (812) 3919-8760",
  email: "trejgun@gmail.com",
  users: [fakeUser],
} as unknown as IMerchant;
