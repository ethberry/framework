// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

import "./SignatureValidator.sol";
import "./ExchangeUtils.sol";
import "./interfaces/IAsset.sol";
import "../Mechanics/Lottery/interfaces/ILottery.sol";

abstract contract ExchangeLottery is SignatureValidator, AccessControl, Pausable {
  event PurchaseLottery(address account, Asset item, Asset price, uint256 round, bytes32 numbers);

  function purchaseLottery(
    Params memory params,
    Asset memory item, // lottery contract
    Asset memory price,
    bytes calldata signature
  ) external whenNotPaused {
    // Verify signature and recover signer
    address signer = _recoverOneToOneSignature(params, item, price, signature);
    // check signer for MINTER_ROLE
    if (!hasRole(MINTER_ROLE, signer)) {
      revert SignerMissingRole();
    }

    RoundInfo memory round = ILottery(item.token).getCurrentRoundInfo();

    // require price === round.acceptedTicket
    if (
      price.tokenType != round.acceptedAsset.tokenType ||
      price.token != round.acceptedAsset.token ||
      price.tokenId != round.acceptedAsset.tokenId ||
      price.amount != round.acceptedAsset.amount
    ) revert WrongPrice();

    ExchangeUtils.spendFrom(
      ExchangeUtils._toArray(price),
      _msgSender(),
      //      address(this),
      item.token,
      DisabledTokenTypes(false, false, false, false, false)
    );

    (uint256 tokenId, uint256 roundId) = ILottery(item.token).printTicket(
      _msgSender(),
      params.extra // selected numbers
    );

    emit PurchaseLottery(
      _msgSender(),
      Asset(TokenType.ERC721, round.ticketAsset.token, tokenId, 1),
      price,
      roundId,
      params.extra
    );

    _afterPurchase(params.referrer, ExchangeUtils._toArray(price));
  }

  function _afterPurchase(address referrer, Asset[] memory price) internal virtual;
}
