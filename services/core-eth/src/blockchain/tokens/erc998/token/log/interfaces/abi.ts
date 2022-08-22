import { FormatTypes, Interface } from "@ethersproject/abi";

import ERC998FullSol from "@framework/core-contracts/artifacts/contracts/ERC998/ERC998Full.sol/ERC998Full.json";

export const ABI = new Interface(ERC998FullSol.abi).format(FormatTypes.full);
