// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.20;

import "@gemunion/contracts-utils/contracts/roles.sol";

import "../../Diamond/override/AccessControlInternal.sol";
import "../../Diamond/override/PausableInternal.sol";
import "../../Exchange/lib/ExchangeUtils.sol";
import "../override/SignatureValidator.sol";
import "../interfaces/ILottery.sol";

contract ExchangeLotteryFacet is SignatureValidator, AccessControlInternal, PausableInternal {
  event PurchaseLottery(address account, uint256 externalId, Asset item, Asset price, uint256 roundId, bytes32 numbers);

  constructor() SignatureValidator() {}

  function purchaseLottery(
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
      params.receiver, // LOTTERY CONTRACT
      DisabledTokenTypes(false, false, false, false, false)
    );

    (uint256 tokenId, uint256 roundId) = ILottery(params.receiver).printTicket(
      params.externalId,
      _msgSender(),
      params.extra // selected numbers
    );

    // set tokenID = ticketID
    item.tokenId = tokenId;

    emit PurchaseLottery(_msgSender(), params.externalId, item, price, roundId, params.extra);
    //    _afterPurchase(params.referrer, ExchangeUtils._toArray(price));
  }

  //  function _afterPurchase(address referrer, Asset[] memory price) internal virtual;
}
