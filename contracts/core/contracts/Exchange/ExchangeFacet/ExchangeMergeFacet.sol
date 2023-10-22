// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.20;

import {MINTER_ROLE} from "@gemunion/contracts-utils/contracts/roles.sol";

import {SignatureValidator} from "../override/SignatureValidator.sol";
import {AccessControlInternal} from "../../Diamond/override/AccessControlInternal.sol";
import {PausableInternal} from "../../Diamond/override/PausableInternal.sol";
import {ExchangeUtils} from "../../Exchange/lib/ExchangeUtils.sol";
import {Asset, Params, DisabledTokenTypes} from "../lib/interfaces/IAsset.sol";
import {SignerMissingRole} from "../../utils/errors.sol";

contract ExchangeMergeFacet is SignatureValidator, AccessControlInternal, PausableInternal {
  event Craft(address account, uint256 externalId, Asset[] items, Asset[] price);

  constructor() SignatureValidator() {}

  function merge(
    Params memory params,
    Asset[] memory items,
    Asset[] memory price,
    bytes calldata signature
  ) external payable whenNotPaused {
    if (!_hasRole(MINTER_ROLE, _recoverManyToManySignature(params, items, price, signature))) {
      revert SignerMissingRole();
    }



    // burn or send price to receiver
    ExchangeUtils.burnFrom(price, _msgSender(), params.receiver, DisabledTokenTypes(false, false, false, false, false));
    ExchangeUtils.acquireFrom(items, params.receiver, _msgSender(), DisabledTokenTypes(false, false, false, false, false));

    emit Craft(_msgSender(), params.externalId, items, price);
  }
}
