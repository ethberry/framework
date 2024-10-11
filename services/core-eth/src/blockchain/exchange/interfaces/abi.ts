import { Interface } from "ethers";

import ExchangeClaimFacetSol from "@framework/core-contracts/artifacts/contracts/Exchange/ExchangeFacet/ExchangeClaimFacet.sol/ExchangeClaimFacet.json";
import ExchangeCraftFacetSol from "@framework/core-contracts/artifacts/contracts/Exchange/ExchangeFacet/ExchangeCraftFacet.sol/ExchangeCraftFacet.json";
import ExchangeDiscreteFacetSol from "@framework/core-contracts/artifacts/contracts/Exchange/ExchangeFacet/ExchangeDiscreteFacet.sol/ExchangeDiscreteFacet.json";
import ExchangeDismantleFacetSol from "@framework/core-contracts/artifacts/contracts/Exchange/ExchangeFacet/ExchangeDismantleFacet.sol/ExchangeDismantleFacet.json";
import ExchangeGenesFacetSol from "@framework/core-contracts/artifacts/contracts/Exchange/ExchangeFacet/ExchangeGenesFacet.sol/ExchangeGenesFacet.json";
import ExchangeLootBoxFacetSol from "@framework/core-contracts/artifacts/contracts/Exchange/ExchangeFacet/ExchangeLootBoxFacet.sol/ExchangeLootBoxFacet.json";
import ExchangeLotteryFacetSol from "@framework/core-contracts/artifacts/contracts/Exchange/ExchangeFacet/ExchangeLotteryFacet.sol/ExchangeLotteryFacet.json";
import ExchangeMergeFacetSol from "@framework/core-contracts/artifacts/contracts/Exchange/ExchangeFacet/ExchangeMergeFacet.sol/ExchangeMergeFacet.json";
import ExchangeMysteryBoxFacetSol from "@framework/core-contracts/artifacts/contracts/Exchange/ExchangeFacet/ExchangeMysteryBoxFacet.sol/ExchangeMysteryBoxFacet.json";
import ExchangePurchaseFacetSol from "@framework/core-contracts/artifacts/contracts/Exchange/ExchangeFacet/ExchangePurchaseFacet.sol/ExchangePurchaseFacet.json";
import ExchangePurchaseRandomFacetSol from "@framework/core-contracts/artifacts/contracts/Exchange/ExchangeFacet/ExchangePurchaseRandomFacet.sol/ExchangePurchaseRandomFacet.json";
import ExchangeRaffleFacetSol from "@framework/core-contracts/artifacts/contracts/Exchange/ExchangeFacet/ExchangeRaffleFacet.sol/ExchangeRaffleFacet.json";
import ExchangeRentableFacetSol from "@framework/core-contracts/artifacts/contracts/Exchange/ExchangeFacet/ExchangeRentableFacet.sol/ExchangeRentableFacet.json";
import ExchangeUtilsSol from "@framework/core-contracts/artifacts/contracts/Exchange/lib/ExchangeUtils.sol/ExchangeUtils.json";

export const ExchangeABI = new Interface([
  ...new Set(
    ([] as Array<any>)
      .concat(ExchangeClaimFacetSol.abi)
      .concat(ExchangeCraftFacetSol.abi)
      .concat(ExchangeDiscreteFacetSol.abi)
      .concat(ExchangeDismantleFacetSol.abi)
      .concat(ExchangeGenesFacetSol.abi)
      .concat(ExchangeLootBoxFacetSol.abi)
      .concat(ExchangeLotteryFacetSol.abi)
      .concat(ExchangeMergeFacetSol.abi)
      .concat(ExchangeMysteryBoxFacetSol.abi)
      .concat(ExchangePurchaseFacetSol.abi)
      .concat(ExchangePurchaseRandomFacetSol.abi)
      .concat(ExchangeRaffleFacetSol.abi)
      .concat(ExchangeRentableFacetSol.abi)
      .concat(ExchangeUtilsSol.abi),
  ),
]);
