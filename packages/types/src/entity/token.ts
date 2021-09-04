export enum TokenType {
  EMAIL = "EMAIL",
  PASSWORD = "PASSWORD",
}

export interface IToken {
  uuid: string;
  tokenType: TokenType;
  createdAt: string;
  updatedAt: string;
}
