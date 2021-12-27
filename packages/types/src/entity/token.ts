import { IUuidBase } from "@gemunion/types-collection";

export enum TokenType {
  EMAIL = "EMAIL",
  PASSWORD = "PASSWORD",
}

export interface IToken extends IUuidBase {
  tokenType: TokenType;
  data: Record<string, string>;
}
