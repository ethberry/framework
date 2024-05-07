import { NodeEnv } from "@framework/types";
import type { IReferralTree } from "@framework/types";

export interface IRefProgramsLevels {
  merchantId: number;
  levels: Array<{ level: number; share: number }>;
}

export const emptyRefProgram = { merchantId: 0, levels: [{ level: 0, share: 0 }] };

export const getMarketUrl = () => {
  return process.env.MARKET_FE_URL
    ? process.env.MARKET_FE_URL
    : process.env.NODE_ENV === NodeEnv.production
      ? "https://market.gemunion.io"
      : "https://st-market-b2b.gemunion.io";
};

export const getRefLevelShare = (
  programs: Array<IRefProgramsLevels>,
  merchantId: number,
  level: number,
): { share: number; totalCount: number } => {
  const referralProgram = programs.filter(prog => prog.merchantId === merchantId);
  if (referralProgram.length === 1) {
    const levelShare = referralProgram[0].levels.filter(lev => lev.level === level);
    if (levelShare.length === 1) {
      return { share: levelShare[0].share, totalCount: referralProgram[0].levels.length - 1 /* level0 - total % */ };
    }
  }
  return { share: 0, totalCount: 0 };
};

export const calculateDepth = (tree: IReferralTree, targetId: number, currentDepth: number = 0): number | null => {
  if (tree.id === targetId) {
    return currentDepth;
  }
  for (const child of tree.children) {
    const depth = calculateDepth(child, targetId, currentDepth + 1);

    if (depth !== null) {
      return depth;
    }
  }
  return null;
};
