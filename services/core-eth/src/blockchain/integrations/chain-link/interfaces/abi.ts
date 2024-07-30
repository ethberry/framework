import { Interface } from "ethers";

import VrfContract from "@framework/core-contracts/artifacts/@gemunion/contracts-chain-link-v2-plus/contracts/mocks/VRFCoordinatorV2Plus.sol/VRFCoordinatorV2PlusMock.json";

export const ABI = new Interface(VrfContract.abi);
