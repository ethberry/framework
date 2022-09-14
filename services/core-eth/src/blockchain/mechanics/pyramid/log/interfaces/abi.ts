import { FormatTypes, Interface } from "@ethersproject/abi";

import PyramidSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Pyramid/Pyramid.sol/Pyramid.json";

export const ABI = new Interface(PyramidSol.abi).format(FormatTypes.full);
