import { Interface } from "ethers";

import LotteryFactoryFacetSol from "@framework/core-contracts/artifacts/contracts/ContractManager/ContractManagerFacets/LotteryFactoryFacet.sol/LotteryFactoryFacet.json";
import LootBoxFactoryFacetSol from "@framework/core-contracts/artifacts/contracts/ContractManager/ContractManagerFacets/LootBoxFactoryFacet.sol/LootBoxFactoryFacet.json";
import MysteryBoxFactoryFacetSol from "@framework/core-contracts/artifacts/contracts/ContractManager/ContractManagerFacets/MysteryBoxFactoryFacet.sol/MysteryBoxFactoryFacet.json";
import PonziFactoryFacetSol from "@framework/core-contracts/artifacts/contracts/ContractManager/ContractManagerFacets/PonziFactoryFacet.sol/PonziFactoryFacet.json";
import RaffleFactoryFacetSol from "@framework/core-contracts/artifacts/contracts/ContractManager/ContractManagerFacets/RaffleFactoryFacet.sol/RaffleFactoryFacet.json";
import StakingFactoryFacetSol from "@framework/core-contracts/artifacts/contracts/ContractManager/ContractManagerFacets/StakingFactoryFacet.sol/StakingFactoryFacet.json";
import VestingFactoryFacetSol from "@framework/core-contracts/artifacts/contracts/ContractManager/ContractManagerFacets/VestingFactoryFacet.sol/VestingFactoryFacet.json";

export const ContractManagerABI = new Interface([
  ...new Set(
    ([] as Array<any>)
      .concat(LotteryFactoryFacetSol.abi)
      .concat(LootBoxFactoryFacetSol.abi)
      .concat(MysteryBoxFactoryFacetSol.abi)
      .concat(PonziFactoryFacetSol.abi)
      .concat(RaffleFactoryFacetSol.abi)
      .concat(StakingFactoryFacetSol.abi)
      .concat(VestingFactoryFacetSol.abi),
  ),
]);
