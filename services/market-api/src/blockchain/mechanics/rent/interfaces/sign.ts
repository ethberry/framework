export interface ISignRentTokenDto {
  tokenId: number; // tokenEntity.id
  account: string; // rent to
  referrer: string; // account borrower
  externalId: number; // EXPIRED time in sec
}
