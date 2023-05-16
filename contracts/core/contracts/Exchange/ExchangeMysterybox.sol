// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

import "../Mechanics/Mysterybox/interfaces/IERC721Mysterybox.sol";
import "./SignatureValidator.sol";
import "./ExchangeUtils.sol";

abstract contract ExchangeMysterybox is SignatureValidator, AccessControl, Pausable {
  event Mysterybox(address from, uint256 externalId, Asset[] items, Asset[] price);

  function mysterybox(
    Params memory params,
    Asset[] memory items,
    Asset[] memory price,
    bytes calldata signature
  ) external payable whenNotPaused {
    address signer = _recoverManyToManySignature(params, items, price, signature);
    if (!hasRole(MINTER_ROLE, signer)) {
      revert SignerMissingRole();
    }

    if (items.length == 0) {
      revert WrongAmount();
    }

    address account = _msgSender();

    ExchangeUtils.spendFrom(price, account, address(this), DisabledTokenTypes(false, false, false, false, false));

    emit Mysterybox(account, params.externalId, items, price);

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

    IERC721Mysterybox(box.token).mintBox(account, box.tokenId, mysteryItems);
    _afterPurchase(params.referrer, price);
  }

  function _afterPurchase(address referrer, Asset[] memory price) internal virtual;
}
