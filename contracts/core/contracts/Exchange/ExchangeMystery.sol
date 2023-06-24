// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

import "../Mechanics/MysteryBox/interfaces/IERC721MysteryBox.sol";
import "./SignatureValidator.sol";
import "./ExchangeUtils.sol";

abstract contract ExchangeMystery is SignatureValidator, AccessControl, Pausable {
  event PurchaseMysteryBox(address account, uint256 externalId, Asset[] items, Asset[] price);

  function purchaseMystery(
    Params memory params,
    Asset[] memory items,
    Asset[] memory price,
    bytes calldata signature
  ) external payable whenNotPaused {
    if (!hasRole(MINTER_ROLE, _recoverManyToManySignature(params, items, price, signature))) {
      revert SignerMissingRole();
    }

    if (items.length == 0) {
      revert WrongAmount();
    }

    ExchangeUtils.spendFrom(price, _msgSender(), address(this), DisabledTokenTypes(false, false, false, false, false));

    emit PurchaseMysteryBox(_msgSender(), params.externalId, items, price);

    // TODO use slice?
    Asset memory box = items[0];

    // pop from array is not supported
    Asset[] memory mysteryItems = new Asset[](items.length - 1);
    uint256 length = items.length;
    for (uint256 i = 1; i < length - 1; ) {
      mysteryItems[i] = items[i];
      unchecked {
        i++;
      }
    }

    IERC721MysteryBox(box.token).mintBox(_msgSender(), box.tokenId, mysteryItems);

    _afterPurchase(params.referrer, price);
  }

  function _afterPurchase(address referrer, Asset[] memory price) internal virtual;
}
