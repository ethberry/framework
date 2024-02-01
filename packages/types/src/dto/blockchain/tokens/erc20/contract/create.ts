export interface IErc20ContractCreateDto {
  symbol: string;
  decimals: number;
  title: string;
  description: string;
  imageUrl?: string;
  address: string;
  merchantId: number;
}
