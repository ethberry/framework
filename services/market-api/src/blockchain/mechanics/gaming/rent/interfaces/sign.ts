export interface ISignRentTokenDto {
  tokenId: number; // tokenEntity.id
  referrer: string; // account to
  expires: number; // EXPIRED time in sec
  externalId: number; // DB Rent rule id
  chainId?: number; // chain
  account?: string; // account from
}
