import { FormatTypes, Interface } from "@ethersproject/abi";

import ERC721SimpleSol from "@framework/core-contracts/artifacts/contracts/ERC721/ERC721Simple.sol/ERC721Simple.json";
import ERC721BlacklistSol from "@framework/core-contracts/artifacts/contracts/ERC721/ERC721Blacklist.sol/ERC721Blacklist.json";
import ERC721GradedSol from "@framework/core-contracts/artifacts/contracts/ERC721/ERC721Graded.sol/ERC721Graded.json";
// import ERC721RandomSol from "@framework/core-contracts/artifacts/contracts/ERC721/ERC721Random.sol/ERC721Random.json";
import ERC721RandomTestSol from "@framework/core-contracts/artifacts/contracts/ERC721/test/ERC721RandomTest.sol/ERC721RandomTest.json";

const iface1 = new Interface(ERC721SimpleSol.abi).format(FormatTypes.full) as Array<any>;
const iface2 = new Interface(ERC721BlacklistSol.abi).format(FormatTypes.full) as Array<any>;
const iface3 = new Interface(ERC721GradedSol.abi).format(FormatTypes.full) as Array<any>;
const iface4 = new Interface(ERC721RandomTestSol.abi).format(FormatTypes.full) as Array<any>;

export const ABI = [...new Set(([] as Array<any>).concat(iface1, iface2, iface3, iface4))];
