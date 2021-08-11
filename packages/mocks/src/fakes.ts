import { v4 } from "uuid";

import { IMerchant, IToken, IUser, TokenType } from "@gemunionstudio/framework-types";
import { DefaultLanguage } from "@gemunionstudio/framework-constants-misc";

export const fakeUser = {
  password: "",
  confirm: "",
  email: "trejgun@gmail.com",
  firstName: "Trej",
  lastName: "Gun",
  phoneNumber: "+62 (812) 3919-8760",
  language: DefaultLanguage,
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
