export enum LeaderboardRank {
  GOLD = "GOLD",
  SILVER = "SILVER",
  BRONZE = "BRONZE",
  BASIC = "BASIC",
}

export interface ILeaderboard {
  id: number;
  email: string;
  wallet: string;
  secureWallet: string;
  rank: LeaderboardRank;
  score: number;
}
