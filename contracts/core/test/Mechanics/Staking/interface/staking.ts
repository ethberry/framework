export interface IRule {
  deposit: IAsset[];
  reward: IAsset[];
  content: IAsset[][];
  period: number;
  penalty: number;
  maxStake: number;
  terms: {
    recurrent: boolean;
    advance: boolean;
  };
  active: boolean;
}

export interface IAsset {
  tokenType: number;
  token: string;
  tokenId: bigint;
  amount: bigint;
}
