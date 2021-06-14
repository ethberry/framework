import {IBase} from "./base";

export enum TokenType {
  EMAIL = "EMAIL",
  PASSWORD = "PASSWORD",
}

export interface IToken extends IBase {
  uuid: string;
  tokenType: TokenType;
}
