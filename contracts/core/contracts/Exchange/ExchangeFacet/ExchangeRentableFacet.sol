// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/utils/math/SafeCast.sol";
import "@gemunion/contracts-erc721/contracts/interfaces/IERC4907.sol";

import "@gemunion/contracts-misc/contracts/roles.sol";

import "../../Diamond/override/AccessControlInternal.sol";
import "../../Diamond/override/PausableInternal.sol";
import "../../Exchange/lib/ExchangeUtils.sol";
import "../override/SignatureValidator.sol";

contract ExchangeRentableFacet is SignatureValidator, AccessControlInternal, PausableInternal {
  using SafeCast for uint256;

  event Lend(address account, address to, uint64 expires, uint256 externalId, Asset item, Asset[] price);
  event LendMany(address account, address to, uint64 expires, uint256 externalId, Asset[] items, Asset[] price);

  constructor() SignatureValidator() {}

  /**
   * @dev Lend an asset to borrower by spending price from owner and setting user
   *
   * @param params Struct of Params that containing the signature parameters.
   * @param item An Assets that will be lent.
   * @param price An Assets[] that will be used as payment.
   * @param signature Signature used to sign the message.
   */
  function lend(
    Params memory params,
    Asset memory item,
    Asset[] memory price,
    bytes calldata signature
  ) external payable whenNotPaused {
    if (!_hasRole(METADATA_ROLE, _recoverOneToManySignature(params, item, price, signature))) {
      revert SignerMissingRole();
    }

    ExchangeUtils.spendFrom(price, _msgSender(), params.receiver, DisabledTokenTypes(false, false, false, false, false));

    IERC4907(item.token).setUser(
      item.tokenId,
      params.referrer /* to */,
      uint256(params.extra).toUint64() /* lend expires */
    );

    emit Lend(
      _msgSender() /* from */,
      params.referrer /* to */,
      uint256(params.extra).toUint64() /* lend expires */,
      params.externalId /* lendRule db id */,
      item,
      price
    );
  }

  function lendMany(
    Params memory params,
    Asset[] memory items,
    Asset[] memory price,
    bytes calldata signature
  ) external payable whenNotPaused {
    if (!_hasRole(METADATA_ROLE, _recoverManyToManySignature(params, items, price, signature))) {
      revert SignerMissingRole();
    }

    if (items.length == 0) {
      revert WrongAmount();
    }

    ExchangeUtils.spendFrom(price, _msgSender(), address(this), DisabledTokenTypes(false, false, false, false, false));

    emit LendMany(
      _msgSender() /* from */,
      params.referrer /* to */,
      uint256(params.extra).toUint64() /* lend expires */,
      params.externalId /* lendRule db id */,
      items,
      price
    );

    for (uint256 i = 0; i < items.length; ) {
      IERC4907(items[i].token).setUser(
        items[i].tokenId,
        params.referrer /* to */,
        uint256(params.extra).toUint64() /* lend expires */
      );
      unchecked {
        i++;
      }
    }
  }
}
