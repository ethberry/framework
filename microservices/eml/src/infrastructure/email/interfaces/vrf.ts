import type { IMerchant } from "@framework/types";

export interface IVrfPayload {
  merchant: IMerchant;
  chainId: number;
}
