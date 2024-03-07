export interface IMergeSignDto {
  chainId: number;
  account: string;
  referrer: string;
  mergeId: number;
  tokenIds: Array<number>;
}
