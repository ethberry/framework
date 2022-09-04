// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

import "../Mysterybox/interfaces/IERC721Mysterybox.sol";
import "./SignatureValidator.sol";
import "./ExchangeUtils.sol";

abstract contract ExchangeMysterybox is SignatureValidator, ExchangeUtils, AccessControl, Pausable {
  event Mysterybox(address from, uint256 externalId, Asset[] items, Asset[] price);

  function mysterybox(
    Params memory params,
    Asset[] memory items,
    Asset[] memory price,
    address signer,
    bytes calldata signature
  ) external payable {
    require(hasRole(MINTER_ROLE, signer), "Exchange: Wrong signer");
    _verifyManyToManySignature(params, items, price, signer, signature);

    require(items.length > 1, "Exchange: Wrong items count");

    address account = _msgSender();

    spend(price, account, address(this));

    emit Mysterybox(account, params.externalId, items, price);

    Asset memory box = items[items.length - 1];
    delete items[items.length - 1];

    IERC721Mysterybox(box.token).mintBox(account, box.tokenId, items);

    _afterPurchase(params);
  }

  function _afterPurchase(Params memory params) internal virtual;
}
