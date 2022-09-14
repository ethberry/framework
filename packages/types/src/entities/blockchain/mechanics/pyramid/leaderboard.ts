export enum PyramidLeaderboardRank {
  GOLD = "GOLD",
  SILVER = "SILVER",
  BRONZE = "BRONZE",
  BASIC = "BASIC",
}

export interface IPyramidLeaderboard {
  id: number;
  email: string;
  wallet: string;
  secureWallet: string;
  rank: PyramidLeaderboardRank;
  score: number;
}
