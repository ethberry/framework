import { Interface } from "ethers";

import ExchangeBreedFacetSol from "@framework/core-contracts/artifacts/contracts/Exchange/ExchangeFacet/ExchangeBreedFacet.sol/ExchangeBreedFacet.json";
import ExchangeClaimFacetSol from "@framework/core-contracts/artifacts/contracts/Exchange/ExchangeFacet/ExchangeClaimFacet.sol/ExchangeClaimFacet.json";
import ExchangeCraftFacetSol from "@framework/core-contracts/artifacts/contracts/Exchange/ExchangeFacet/ExchangeCraftFacet.sol/ExchangeCraftFacet.json";
import ExchangeDismantleFacetSol from "@framework/core-contracts/artifacts/contracts/Exchange/ExchangeFacet/ExchangeDismantleFacet.sol/ExchangeDismantleFacet.json";
import ExchangeGradeFacetSol from "@framework/core-contracts/artifacts/contracts/Exchange/ExchangeFacet/ExchangeGradeFacet.sol/ExchangeGradeFacet.json";
import ExchangeLootBoxFacetSol from "@framework/core-contracts/artifacts/contracts/Exchange/ExchangeFacet/ExchangeLootBoxFacet.sol/ExchangeLootBoxFacet.json";
import ExchangeLotteryFacetSol from "@framework/core-contracts/artifacts/contracts/Exchange/ExchangeFacet/ExchangeLotteryFacet.sol/ExchangeLotteryFacet.json";
import ExchangeMergeFacetSol from "@framework/core-contracts/artifacts/contracts/Exchange/ExchangeFacet/ExchangeMergeFacet.sol/ExchangeMergeFacet.json";
import ExchangeMysteryBoxFacetSol from "@framework/core-contracts/artifacts/contracts/Exchange/ExchangeFacet/ExchangeMysteryBoxFacet.sol/ExchangeMysteryBoxFacet.json";
import ExchangePurchaseFacetSol from "@framework/core-contracts/artifacts/contracts/Exchange/ExchangeFacet/ExchangePurchaseFacet.sol/ExchangePurchaseFacet.json";
import ExchangeRaffleFacetSol from "@framework/core-contracts/artifacts/contracts/Exchange/ExchangeFacet/ExchangeRaffleFacet.sol/ExchangeRaffleFacet.json";
import ExchangeRentableFacetSol from "@framework/core-contracts/artifacts/contracts/Exchange/ExchangeFacet/ExchangeRentableFacet.sol/ExchangeRentableFacet.json";
import ExchangeUtilsSol from "@framework/core-contracts/artifacts/contracts/Exchange/lib/ExchangeUtils.sol/ExchangeUtils.json";

export const ExchangeABI = new Interface([
  ...new Set(
    ([] as Array<any>)
      .concat(ExchangeBreedFacetSol.abi)
      .concat(ExchangeClaimFacetSol.abi)
      .concat(ExchangeCraftFacetSol.abi)
      .concat(ExchangeDismantleFacetSol.abi)
      .concat(ExchangeGradeFacetSol.abi)
      .concat(ExchangeLootBoxFacetSol.abi)
      .concat(ExchangeLotteryFacetSol.abi)
      .concat(ExchangeMergeFacetSol.abi)
      .concat(ExchangeMysteryBoxFacetSol.abi)
      .concat(ExchangePurchaseFacetSol.abi)
      .concat(ExchangeRaffleFacetSol.abi)
      .concat(ExchangeRentableFacetSol.abi)
      .concat(ExchangeUtilsSol.abi),
  ),
]);
