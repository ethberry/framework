// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@gemunion/contracts-chain-link-v2/contracts/extensions/ChainLinkBinance.sol";

import "../LotteryRaffleRandom.sol";

contract LotteryRaffleRandomBinance is LotteryRaffleRandom, ChainLinkBinance {
  using Counters for Counters.Counter;

  constructor(
    string memory name,
    Raffle memory config
  ) LotteryRaffleRandom(name, config) ChainLinkBinance(uint64(1), uint16(6), uint32(600000), uint32(1)) {}

  function getRandomNumber() internal override(LotteryRaffleRandom, ChainLinkBase) returns (uint256 requestId) {
    return super.getRandomNumber();
  }

  function fulfillRandomWords(
    uint256 requestId,
    uint256[] memory randomWords
  ) internal override(LotteryRaffleRandom, VRFConsumerBaseV2) {
    return super.fulfillRandomWords(requestId, randomWords);
  }
}
