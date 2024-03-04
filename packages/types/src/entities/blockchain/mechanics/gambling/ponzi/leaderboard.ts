export enum PonziLeaderboardRank {
  GOLD = "GOLD",
  SILVER = "SILVER",
  BRONZE = "BRONZE",
  BASIC = "BASIC",
}

export interface IPonziLeaderboard {
  id: number;
  email: string;
  wallet: string;
  secureWallet: string;
  rank: PonziLeaderboardRank;
  score: number;
}
