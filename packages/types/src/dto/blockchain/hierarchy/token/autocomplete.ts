export interface ITokenAutocompleteDto {
  contractIds: Array<number>;
  templateIds: Array<number>;

  chainId: number;
  merchantId: number;
}
