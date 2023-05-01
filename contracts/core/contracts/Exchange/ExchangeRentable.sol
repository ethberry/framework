// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/math/SafeCast.sol";
import "@gemunion/contracts-erc721/contracts/interfaces/IERC4907.sol";

import "./SignatureValidator.sol";
import "./ExchangeUtils.sol";

abstract contract ExchangeRentable is SignatureValidator, AccessControl, Pausable {
  using SafeCast for uint256;

  event Lend(address from, address to, uint64 expires, uint256 externalId, Asset[] items, Asset[] price);

  function lend(
    Params memory params,
    Asset[] memory items,
    Asset[] memory price,
    bytes32 expires,
    bytes calldata signature
  ) external payable whenNotPaused {
    address signer = _recoverManyToManyExtraSignature(params, items, price, expires, signature);
    if (!hasRole(METADATA_ROLE, signer)) revert WrongSigner();

    if (items.length == 0) revert WrongAmount();

    address account = _msgSender();

    if (price.length > 0) {
      ExchangeUtils.spendFrom(price, account, address(this), DisabledTokenTypes(false, false, false, false, false));
    }

    emit Lend(
      account /* from */,
      params.referrer /* to */,
      uint256(expires).toUint64() /* lend expires */,
      params.externalId /* lendRule db id */,
      items,
      price
    );

    for (uint256 i = 0; i < items.length; i++) {
      IERC4907(items[i].token).setUser(
        items[i].tokenId,
        params.referrer /* to */,
        uint256(expires).toUint64() /* lend expires */
      );
    }
  }
}
