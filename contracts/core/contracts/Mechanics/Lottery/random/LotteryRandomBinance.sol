// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@gemunion/contracts-chain-link/contracts/extensions/ChainLinkBinance.sol";

import "../LotteryRandom.sol";

contract LotteryRandomBinance is LotteryRandom, ChainLinkBinance {
  constructor(
    string memory name,
    address ticketFactory,
    address acceptedToken
  ) LotteryRandom(name, ticketFactory, acceptedToken) {}

  function getRandomNumber() internal override(LotteryRandom, ChainLinkBase) returns (bytes32 requestId) {
    return super.getRandomNumber();
  }

  function fulfillRandomness(bytes32 random, uint256 randomness) internal override(LotteryRandom, VRFConsumerBase) {
    super.fulfillRandomness(random, randomness);
  }
}
