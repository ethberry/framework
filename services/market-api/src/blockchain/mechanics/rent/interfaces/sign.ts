export interface ISignRentTokenDto {
  tokenId: number; // tokenEntity.id
  account: string; // account from
  referrer: string; // account to
  expires: number; // EXPIRED time in sec
  externalId: number; // Lend type
}
