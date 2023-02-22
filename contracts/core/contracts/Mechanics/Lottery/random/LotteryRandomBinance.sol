// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@gemunion/contracts-chain-link/contracts/extensions/ChainLinkBinanceV2.sol";

import "../LotteryRandom.sol";

contract LotteryRandomBinance is LotteryRandom, ChainLinkBinanceV2 {
  constructor(
    string memory name,
    address ticketFactory,
    address acceptedToken
  ) LotteryRandom(name, ticketFactory, acceptedToken)
  ChainLinkBinanceV2(uint64(1), uint16(6),uint32(600000),uint32(1))
  {}

  function getRandomNumber() internal override(LotteryRandom, ChainLinkBaseV2) returns (uint256 requestId) {
    return super.getRandomNumber();
  }

  function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal
  override(LotteryRandom, VRFConsumerBaseV2) {
    return super.fulfillRandomWords(requestId, randomWords);
  }
}
