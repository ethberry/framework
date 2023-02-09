import { FormatTypes, Interface } from "@ethersproject/abi";

import VrfContract from "@framework/core-contracts/artifacts/@gemunion/contracts-chain-link/contracts/mocks/VrfCoordinator.sol/VRFCoordinatorMock.json";

export const ABI = new Interface(VrfContract.abi).format(FormatTypes.full);
