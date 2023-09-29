import { Interface } from "ethers";

// must use random implementation which includes VrfSubscriptionSet event
import ERC998BlacklistDiscreteRandomBesuSol from "@framework/core-contracts/artifacts/contracts/ERC998/random/ERC998BlacklistDiscreteRandomBesu.sol/ERC998BlacklistDiscreteRandomBesu.json";
// TODO add setVrfSubs. abi here
export const ABIRandom = new Interface(ERC998BlacklistDiscreteRandomBesuSol.abi);
