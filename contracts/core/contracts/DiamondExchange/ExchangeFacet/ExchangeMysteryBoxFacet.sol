// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

// import "@openzeppelin/contracts/access/AccessControl.sol";
//import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
//import "@openzeppelin/contracts/utils/math/SafeCast.sol";

import "../override/SignatureValidator.sol";
import "../../Diamond/override/AccessControlInternal.sol";
import "../../Diamond/override/PausableInternal.sol";

import "../../Exchange/ExchangeUtils.sol";
import "../../Mechanics/Mysterybox/interfaces/IERC721MysteryBox.sol";

//import "../../Exchange/interfaces/IAsset.sol";
contract ExchangeMysteryBoxFacet is SignatureValidator, AccessControlInternal, PausableInternal {
  event Mysterybox(address from, uint256 externalId, Asset[] items, Asset[] price);

  constructor() SignatureValidator() {}

  function purchaseMystery(
    Params memory params,
    Asset[] memory items,
    Asset[] memory price,
    bytes calldata signature
  ) external payable whenNotPaused {
    if (!_hasRole(MINTER_ROLE, _recoverManyToManySignature(params, items, price, signature))) {
      revert SignerMissingRole();
    }

    if (items.length == 0) {
      revert WrongAmount();
    }

    ExchangeUtils.spendFrom(price, _msgSender(), address(this), DisabledTokenTypes(false, false, false, false, false));

    emit Mysterybox(_msgSender(), params.externalId, items, price);

    Asset memory box = items[items.length - 1];

    // pop from array is not supported
    Asset[] memory mysteryItems = new Asset[](items.length - 1);
    uint256 length = items.length;
    for (uint256 i = 0; i < length - 1; ) {
      mysteryItems[i] = items[i];
      unchecked {
        i++;
      }
    }

    IERC721MysteryBox(box.token).mintBox(_msgSender(), box.tokenId, mysteryItems);

    //    _afterPurchase(params.referrer, price);
  }

  //  function _afterPurchase(address referrer, Asset[] memory price) internal virtual;
}
