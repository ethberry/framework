// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "./LotteryBase.sol";
import "./extensions/ChainLinkBinance.sol";

contract Lottery is LotteryBase, ChainLinkBinance {
  constructor(
    string memory name,
    address ticketFactory,
    address acceptedToken
  ) LotteryBase(name, ticketFactory, acceptedToken) {}

  function getRandomNumber() internal override(LotteryBase, ChainLink) returns (bytes32 requestId) {
    return super.getRandomNumber();
  }

  function fulfillRandomness(bytes32 random, uint256 randomness) internal override(LotteryBase, VRFConsumerBase) {
    super.fulfillRandomness(random, randomness);
  }
}
