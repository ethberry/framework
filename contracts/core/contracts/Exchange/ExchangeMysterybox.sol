// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

import "../Mechanics/Mysterybox/interfaces/IERC721Mysterybox.sol";
import "./SignatureValidator.sol";
import "./ExchangeUtils.sol";

abstract contract ExchangeMysterybox is SignatureValidator, ExchangeUtils, AccessControl, Pausable {
  event Mysterybox(address from, uint256 externalId, Asset[] items, Asset[] price);

  function mysterybox(
    Params memory params,
    Asset[] memory items,
    Asset[] memory price,
    bytes calldata signature
  ) external payable {
    address signer = _recoverManyToManySignature(params, items, price, signature);
    require(hasRole(MINTER_ROLE, signer), "Exchange: Wrong signer");

    require(items.length > 1, "Exchange: Wrong items count");

    address account = _msgSender();

    spendFrom(price, account, address(this));

    emit Mysterybox(account, params.externalId, items, price);

    Asset memory box = items[items.length - 1];
    delete items[items.length - 1];

    IERC721Mysterybox(box.token).mintBox(account, box.tokenId, items);

    _afterPurchase(params.referrer, price);
  }

  function _afterPurchase(address referrer, Asset[] memory price) internal virtual;
}
