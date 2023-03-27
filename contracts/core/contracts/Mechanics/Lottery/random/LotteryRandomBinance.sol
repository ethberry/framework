// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@gemunion/contracts-chain-link-v2/contracts/extensions/ChainLinkBinance.sol";

import "../LotteryRandom.sol";

contract LotteryRandomBinance is LotteryRandom, ChainLinkBinance {
  constructor(
    string memory name
  ) LotteryRandom(name) ChainLinkBinance(uint64(1), uint16(6), uint32(600000), uint32(1)) {}

  function getRandomNumber() internal override(LotteryRandom, ChainLinkBase) returns (uint256 requestId) {
    return super.getRandomNumber();
  }

  function fulfillRandomWords(
    uint256 requestId,
    uint256[] memory randomWords
  ) internal override(LotteryRandom, VRFConsumerBaseV2) {
    return super.fulfillRandomWords(requestId, randomWords);
  }
}
