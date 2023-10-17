import type { IBalance } from "@framework/types";

export const emptyBalance = { id: 1, token: { template: { contract: { decimals: 18, symbol: "ETH" } } } } as IBalance;
