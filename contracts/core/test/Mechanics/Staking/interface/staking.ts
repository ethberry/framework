export interface IRule {
  deposit: IAsset[];
  reward: IAsset[];
  content: IAsset[][];
  period: number;
  penalty: number;
  recurrent: boolean;
  active: boolean;
}

export interface IAsset {
  tokenType: number;
  token: string;
  tokenId: number;
  amount: number;
}
