// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.20;

import {MINTER_ROLE} from "@gemunion/contracts-utils/contracts/roles.sol";

import {AccessControlInternal} from "../../Diamond/override/AccessControlInternal.sol";
import {PausableInternal} from "../../Diamond/override/PausableInternal.sol";
import {ExchangeUtils} from "../../Exchange/lib/ExchangeUtils.sol";
import {SignatureValidator} from "../override/SignatureValidator.sol";
import {Asset, Params, DisabledTokenTypes} from "../lib/interfaces/IAsset.sol";
import {SignerMissingRole, NotExist} from "../../utils/errors.sol";

contract ExchangePurchaseFacet is SignatureValidator, AccessControlInternal, PausableInternal {
  event Purchase(address account, uint256 externalId, /* template.id */ Asset item, Asset[] price);

  constructor() SignatureValidator() {}

  function purchase(
    Params memory params,
    Asset memory item,
    Asset[] memory price,
    bytes calldata signature
  ) external payable whenNotPaused {
    address signer = _recoverOneToManySignature(params, item, price, signature);
    if (!_hasRole(MINTER_ROLE, signer)) {
      revert SignerMissingRole();
    }

    if (params.receiver == address(0)) {
      revert NotExist();
    }

    ExchangeUtils.spendFrom(
      price,
      _msgSender(),
      params.receiver,
      DisabledTokenTypes(false, false, false, false, false)
    );

    ExchangeUtils.acquireFrom(
      ExchangeUtils._toArray(item),
      params.receiver,
      _msgSender(),
      DisabledTokenTypes(false, false, false, false, false)
    );

    emit Purchase(_msgSender(), params.externalId, item, price);
    // _afterPurchase(params.referrer, price);
  }
}
