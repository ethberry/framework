import { Interface } from "ethers";

import ExchangeBreedFacetSol from "@framework/core-contracts/artifacts/contracts/Exchange/ExchangeFacet/ExchangeBreedFacet.sol/ExchangeBreedFacet.json";
import ExchangeClaimFacetSol from "@framework/core-contracts/artifacts/contracts/Exchange/ExchangeFacet/ExchangeClaimFacet.sol/ExchangeClaimFacet.json";
import ExchangeCraftFacetSol from "@framework/core-contracts/artifacts/contracts/Exchange/ExchangeFacet/ExchangeCraftFacet.sol/ExchangeCraftFacet.json";
import ExchangeGradeFacetSol from "@framework/core-contracts/artifacts/contracts/Exchange/ExchangeFacet/ExchangeGradeFacet.sol/ExchangeGradeFacet.json";
import ExchangeLotteryFacetSol from "@framework/core-contracts/artifacts/contracts/Exchange/ExchangeFacet/ExchangeLotteryFacet.sol/ExchangeLotteryFacet.json";
import ExchangeMysteryBoxFacetSol from "@framework/core-contracts/artifacts/contracts/Exchange/ExchangeFacet/ExchangeMysteryBoxFacet.sol/ExchangeMysteryBoxFacet.json";
import ExchangePurchaseFacetSol from "@framework/core-contracts/artifacts/contracts/Exchange/ExchangeFacet/ExchangePurchaseFacet.sol/ExchangePurchaseFacet.json";
import ExchangeRaffleFacetSol from "@framework/core-contracts/artifacts/contracts/Exchange/ExchangeFacet/ExchangeRaffleFacet.sol/ExchangeRaffleFacet.json";
import ExchangeRentableFacetSol from "@framework/core-contracts/artifacts/contracts/Exchange/ExchangeFacet/ExchangeRentableFacet.sol/ExchangeRentableFacet.json";
import ExchangeUtilsSol from "@framework/core-contracts/artifacts/contracts/Exchange/lib/ExchangeUtils.sol/ExchangeUtils.json";

export const ABI = new Interface([
  ...new Set(
    ExchangeBreedFacetSol.abi
      .concat(ExchangeClaimFacetSol.abi)
      .concat(ExchangeCraftFacetSol.abi)
      .concat(ExchangeGradeFacetSol.abi)
      .concat(ExchangeLotteryFacetSol.abi)
      .concat(ExchangeMysteryBoxFacetSol.abi)
      .concat(ExchangePurchaseFacetSol.abi)
      .concat(ExchangeRaffleFacetSol.abi)
      .concat(ExchangeRentableFacetSol.abi)
      .concat(ExchangeUtilsSol.abi),
  ),
]);
