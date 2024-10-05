import { Interface } from "ethers";

import VrfContract from "@framework/core-contracts/artifacts/@ethberry/contracts-chain-link-v2-plus/contracts/mocks/VRFCoordinatorV2Plus.sol/VRFCoordinatorV2PlusMock.json";

export const VrfABI = new Interface(VrfContract.abi);
