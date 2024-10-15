import { Interface } from "ethers";

import ReferralSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Referral/Referral.sol/Referral.json";

export const ReferralABI = new Interface(ReferralSol.abi);
