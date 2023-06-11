import { Interface } from "ethers";

import VrfContract from "@framework/core-contracts/artifacts/@gemunion/contracts-chain-link-v2/contracts/mocks/VRFCoordinator.sol/VRFCoordinatorMock.json";

export const ABI = new Interface(VrfContract.abi).format();
