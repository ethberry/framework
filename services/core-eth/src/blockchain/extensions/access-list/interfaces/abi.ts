import { Interface } from "ethers";

import BlackListSol from "@framework/core-contracts/artifacts/@ethberry/contracts-access/contracts/extension/BlackList.sol/BlackList.json";
import WhiteListSol from "@framework/core-contracts/artifacts/@ethberry/contracts-access/contracts/extension/WhiteList.sol/WhiteList.json";

export const AccessListABI = new Interface([
  ...new Set(([] as Array<any>).concat(BlackListSol.abi).concat(WhiteListSol.abi)),
]);
