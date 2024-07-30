import { Interface } from "ethers";

// must use random implementation which includes VrfSubscriptionSet event
import ERC998BlacklistDiscreteRandomBesuSol from "@framework/core-contracts/artifacts/contracts/ERC998/random/ERC998BlacklistDiscreteRandomGemunion.sol/ERC998BlacklistDiscreteRandomGemunion.json";
// TODO add setVrfSubs. abi here
export const ABIRandom = new Interface(ERC998BlacklistDiscreteRandomBesuSol.abi);
