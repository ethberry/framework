// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.4;

import "@gemunion/contracts/contracts/AccessList/WhiteList.sol";

import "./AuctionERC721ETH.sol";

contract AuctionERC721 is AuctionERC721ETH, WhiteList {
  function startAuction(
    address collection,
    uint256 tokenId,
    uint256 buyoutPrice,
    uint256 startPrice,
    uint256 bidStep,
    uint256 startAuctionTimestamp,
    uint256 finishAuctionTimestamp
  ) public override whenNotPaused {
    require(isWhitelisted(collection), "AuctionERC721: the contract is not on the whitelist");
    super.startAuction(collection, tokenId, buyoutPrice, startPrice, bidStep, startAuctionTimestamp, finishAuctionTimestamp);
  }
}
