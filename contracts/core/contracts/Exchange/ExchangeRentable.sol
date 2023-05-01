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
    bytes calldata signature
  ) external payable whenNotPaused {
    address signer = _recoverManyToManySignature(params, items, price, signature);
    if (!hasRole(METADATA_ROLE, signer)) revert SignerMissingRole();

    if (items.length == 0) revert WrongAmount();

    address account = _msgSender();

    if (price.length > 0) {
      ExchangeUtils.spendFrom(price, account, address(this), DisabledTokenTypes(false, false, false, false, false));
    }

    uint64 expires = uint256(params.extra).toUint64();

    emit Lend(
      account /* from */,
      params.referrer /* to */,
      expires /* lend expires */,
      params.externalId /* lendRule db id */,
      items,
      price
    );

    uint256 length = items.length;
    for (uint256 i = 0; i < length; ) {
      IERC4907(items[i].token).setUser(items[i].tokenId, params.referrer /* to */, expires /* lend expires */);
      unchecked {
        i++;
      }
    }
  }
}
