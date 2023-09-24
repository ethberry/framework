import { Interface } from "ethers";

import VrfContract from "@framework/core-contracts/artifacts/@gemunion/contracts-chain-link-v2/contracts/mocks/VRFCoordinatorV2.sol/VRFCoordinatorV2Mock.json";

export const ABI = new Interface(VrfContract.abi);
