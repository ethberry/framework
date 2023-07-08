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
import "../../Exchange/interfaces/IRaffle.sol";

//import "../../Exchange/interfaces/IAsset.sol";
contract ExchangeRaffleFacet is SignatureValidator, AccessControlInternal, PausableInternal {
  event PurchaseRaffle(address account, uint256 externalId, Asset[] items, Asset price, uint256 roundId);

  constructor() SignatureValidator() {}

  function purchaseRaffle(
    Params memory params,
    Asset[] memory items, // [0] - lottery contract, [1] - ticket contract
    Asset memory price,
    bytes calldata signature
  ) external payable whenNotPaused {
    // Verify signature and check signer for MINTER_ROLE
    if (!_hasRole(MINTER_ROLE, _recoverManyToManySignature(params, items, ExchangeUtils._toArray(price), signature))) {
      revert SignerMissingRole();
    }

    if (items.length == 0) {
      revert WrongAmount();
    }

    ExchangeUtils.spendFrom(
      ExchangeUtils._toArray(price),
      _msgSender(),
      items[0].token,
      DisabledTokenTypes(false, false, false, false, false)
    );

    (uint256 tokenId, uint256 roundId) = IRaffle(items[0].token).printTicket(_msgSender());

    // set tokenID = ticketID
    items[1].tokenId = tokenId;

    emit PurchaseRaffle(_msgSender(), params.externalId, items, price, roundId);

    //    _afterPurchase(params.referrer, ExchangeUtils._toArray(price));
  }

  //  function _afterPurchase(address referrer, Asset[] memory price) internal virtual;
}
