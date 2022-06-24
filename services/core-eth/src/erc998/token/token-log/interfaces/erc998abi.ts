import { FormatTypes, Interface } from "@ethersproject/abi";

import ERC998GradedSol from "@framework/core-contracts/artifacts/contracts/ERC721/ERC721Graded.sol/ERC721Graded.json";
// import ERC998RandomSol from "@framework/core-contracts/artifacts/contracts/ERC998/ERC998Random.sol/ERC998Random.json";
import ERC998RandomTestSol from "@framework/core-contracts/artifacts/contracts/ERC721/test/ERC721RandomTest.sol/ERC721RandomTest.json";
import ERC998SimpleSol from "@framework/core-contracts/artifacts/contracts/ERC721/ERC721Simple.sol/ERC721Simple.json";

const iface1 = new Interface(ERC998SimpleSol.abi).format(FormatTypes.full) as Array<any>;
const iface2 = new Interface(ERC998GradedSol.abi).format(FormatTypes.full) as Array<any>;
const iface3 = new Interface(ERC998RandomTestSol.abi).format(FormatTypes.full) as Array<any>;

export const ERC998Abi = [...new Set(([] as Array<any>).concat(iface1, iface2, iface3))];
