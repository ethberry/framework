export enum StakingLeaderboardRank {
  GOLD = "GOLD",
  SILVER = "SILVER",
  BRONZE = "BRONZE",
  BASIC = "BASIC",
}

export interface IStakingLeaderboard {
  id: number;
  email: string;
  wallet: string;
  secureWallet: string;
  rank: StakingLeaderboardRank;
  score: number;
}
