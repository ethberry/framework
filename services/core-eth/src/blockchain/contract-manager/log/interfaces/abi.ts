import { Interface } from "ethers";

import CollectionFactoryFacetSol from "@framework/core-contracts/artifacts/contracts/DiamondContractManager/ContractManagerFacets/CollectionFactoryFacet.sol/CollectionFactoryFacet.json";
import ERC20FactoryFacetSol from "@framework/core-contracts/artifacts/contracts/DiamondContractManager/ContractManagerFacets/ERC20FactoryFacet.sol/ERC20FactoryFacet.json";
import ERC721FactoryFacetSol from "@framework/core-contracts/artifacts/contracts/DiamondContractManager/ContractManagerFacets/ERC721FactoryFacet.sol/ERC721FactoryFacet.json";
import ERC998FactoryFacetSol from "@framework/core-contracts/artifacts/contracts/DiamondContractManager/ContractManagerFacets/ERC998FactoryFacet.sol/ERC998FactoryFacet.json";
import ERC1155FactoryFacetSol from "@framework/core-contracts/artifacts/contracts/DiamondContractManager/ContractManagerFacets/ERC1155FactoryFacet.sol/ERC1155FactoryFacet.json";
import LotteryFactoryFacetSol from "@framework/core-contracts/artifacts/contracts/DiamondContractManager/ContractManagerFacets/LotteryFactoryFacet.sol/LotteryFactoryFacet.json";
import MysteryBoxFactoryFacetSol from "@framework/core-contracts/artifacts/contracts/DiamondContractManager/ContractManagerFacets/MysteryBoxFactoryFacet.sol/MysteryBoxFactoryFacet.json";
import PyramidFactoryFacetSol from "@framework/core-contracts/artifacts/contracts/DiamondContractManager/ContractManagerFacets/PyramidFactoryFacet.sol/PyramidFactoryFacet.json";
import RaffleFactoryFacetSol from "@framework/core-contracts/artifacts/contracts/DiamondContractManager/ContractManagerFacets/RaffleFactoryFacet.sol/RaffleFactoryFacet.json";
import StakingFactoryFacetSol from "@framework/core-contracts/artifacts/contracts/DiamondContractManager/ContractManagerFacets/StakingFactoryFacet.sol/StakingFactoryFacet.json";
import VestingFactoryFacetSol from "@framework/core-contracts/artifacts/contracts/DiamondContractManager/ContractManagerFacets/VestingFactoryFacet.sol/VestingFactoryFacet.json";
import WaitListFactoryFacetSol from "@framework/core-contracts/artifacts/contracts/DiamondContractManager/ContractManagerFacets/WaitListFactoryFacet.sol/WaitListFactoryFacet.json";

export const ABI = new Interface([
  ...new Set(
    CollectionFactoryFacetSol.abi
      .concat(ERC20FactoryFacetSol.abi)
      .concat(ERC721FactoryFacetSol.abi)
      .concat(ERC998FactoryFacetSol.abi)
      .concat(ERC1155FactoryFacetSol.abi)
      .concat(LotteryFactoryFacetSol.abi)
      .concat(MysteryBoxFactoryFacetSol.abi)
      .concat(PyramidFactoryFacetSol.abi)
      .concat(RaffleFactoryFacetSol.abi)
      .concat(StakingFactoryFacetSol.abi)
      .concat(VestingFactoryFacetSol.abi)
      .concat(WaitListFactoryFacetSol.abi),
  ),
]);
