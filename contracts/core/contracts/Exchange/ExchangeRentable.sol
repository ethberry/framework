// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@gemunion/contracts-erc721/contracts/interfaces/IERC4907.sol";

import "../Mechanics/Mysterybox/interfaces/IERC721Mysterybox.sol";
import "./SignatureValidator.sol";
import "./ExchangeUtils.sol";

abstract contract ExchangeRentable is SignatureValidator, ExchangeUtils, AccessControl, Pausable {
  event Lend(address from, address to, uint256 expires, Asset[] items, Asset[] price);

  function lend(
    Params memory params,
    Asset[] memory items,
    Asset[] memory price,
    bytes calldata signature
  ) external payable whenNotPaused {
    address signer = _recoverManyToManySignature(params, items, price, signature);
    require(hasRole(MINTER_ROLE, signer), "Exchange: Wrong signer");

    require(items.length > 0, "Exchange: Wrong items count");

    address account = _msgSender();

    if (price.length > 0) {
      spendFrom(price, account, address(this));
    }

    emit Lend(account, params.referrer /* to */, params.externalId /* expires */, items, price);

    for (uint256 i = 0; i < items.length; i++) {
      // TODO check externalId=expiresAt is less max(uint64)
      IERC4907(items[i].token).setUser(
        items[i].tokenId,
        /* to */ params.referrer,
        /* rent expires */ uint64(params.externalId)
      );
    }
  }
}
