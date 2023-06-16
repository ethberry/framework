// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

import "./SignatureValidator.sol";
import "./ExchangeUtils.sol";
import "./interfaces/IAsset.sol";
import "./interfaces/ILottery.sol";

abstract contract ExchangeLottery is SignatureValidator, AccessControl, Pausable {
  event PurchaseLottery(address account, Asset[] items, Asset price, uint256 roundId, bytes32 numbers);

  function purchaseLottery(
    Params memory params,
    Asset[] memory items, // [0] - lottery contract, [1] - ticket contract
    Asset memory price,
    bytes calldata signature
  ) external whenNotPaused {
    // Verify signature and check signer for MINTER_ROLE
    if (!hasRole(MINTER_ROLE, _recoverManyToManySignature(params, items, ExchangeUtils._toArray(price), signature))) {
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

    (uint256 tokenId, uint256 roundId) = ILottery(items[0].token).printTicket(
      _msgSender(),
      params.extra // selected numbers
    );

    // set tokenID = ticketID
    items[1].tokenId = tokenId;

    emit PurchaseLottery(_msgSender(), items, price, roundId, params.extra);

    _afterPurchase(params.referrer, ExchangeUtils._toArray(price));
  }

  function _afterPurchase(address referrer, Asset[] memory price) internal virtual;
}
