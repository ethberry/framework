export enum TokenType {
  EMAIL = "EMAIL",
  PASSWORD = "PASSWORD",
}

export interface IToken {
  uuid: string;
  tokenType: TokenType;
  data: any;
  createdAt: string;
  updatedAt: string;
}
