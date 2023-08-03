// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "../override/SignatureValidator.sol";
import "../../Diamond/override/AccessControlInternal.sol";
import "../../Diamond/override/PausableInternal.sol";
import "../../Exchange/lib/ExchangeUtils.sol";
import "../interfaces/IRaffle.sol";

contract ExchangeRaffleFacet is SignatureValidator, AccessControlInternal, PausableInternal {
  event PurchaseRaffle(address account, uint256 externalId, Asset item, Asset price, uint256 roundId, uint256 index);

  constructor() SignatureValidator() {}

  function purchaseRaffle(
    Params memory params,
    Asset memory item, // ticket contract
    Asset memory price,
    bytes calldata signature
  ) external payable whenNotPaused {
    // Verify signature and check signer for MINTER_ROLE
    if (!_hasRole(MINTER_ROLE, _recoverOneToOneSignature(params, item, price, signature))) {
      revert SignerMissingRole();
    }

    if (item.token == address(0)) {
      revert WrongToken();
    }

    if (params.receiver == address(0)) {
      revert NotExist();
    }

    ExchangeUtils.spendFrom(
      ExchangeUtils._toArray(price),
      _msgSender(),
      params.receiver, // RAFFLE CONTRACT
      DisabledTokenTypes(false, false, false, false, false)
    );

    (uint256 tokenId, uint256 roundId, uint256 index) = IRaffle(params.receiver).printTicket(
      params.externalId,
      _msgSender()
    );

    // set tokenID = ticketID
    item.tokenId = tokenId;

    emit PurchaseRaffle(_msgSender(), params.externalId, item, price, roundId, index);

    //    _afterPurchase(params.referrer, ExchangeUtils._toArray(price));
  }

  //  function _afterPurchase(address referrer, Asset[] memory price) internal virtual;
}
