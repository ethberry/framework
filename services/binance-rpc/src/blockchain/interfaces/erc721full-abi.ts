// import { ContractInterface } from "@ethersproject/contracts";
import { Interface, FormatTypes } from "@ethersproject/abi";

import ERC721Graded from "@framework/binance-contracts/artifacts/contracts/ERC721/ERC721Graded.sol/ERC721Graded.json";
// import ERC721Random from "@framework/binance-contracts/artifacts/contracts/ERC721/ERC721Random.sol/ERC721Random.json";
import ERC721RandomTest from "@framework/binance-contracts/artifacts/contracts/ERC721/test/ERC721RandomTest.sol/ERC721RandomTest.json";
import ERC721Simple from "@framework/binance-contracts/artifacts/contracts/ERC721/ERC721Simple.sol/ERC721Simple.json";

const iface1 = new Interface(ERC721Simple.abi).format(FormatTypes.minimal) as Array<string>;
const iface2 = new Interface(ERC721Graded.abi).format(FormatTypes.minimal) as Array<string>;
const iface3 = new Interface(ERC721RandomTest.abi).format(FormatTypes.minimal) as Array<string>;

export const ERC721Abi = [...new Set(iface1.concat(iface2).concat(iface3))];

// let unique = [...new Set(myArray)];

// TODO concat and filter interfaces
// export const ERC721FullAbi = Object.values(
//   ([] as Array<ContractInterface>)
//     // @ts-ignore
//     .concat(iface1, iface2, iface3)
//     // .filter(el => {
//     //   return el.type === "event";
//     // })
//     .reduce((memo, current) => {
//       if (current.name && !(current.name in memo)) {
//         memo[current.name] = current;
//       }
//       return memo;
//     }, {} as Record<string, Interface>),
// );
