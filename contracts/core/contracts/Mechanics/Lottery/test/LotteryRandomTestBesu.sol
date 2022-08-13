// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "../LotteryBase.sol";
import "../../../MOCKS/ChainLink/ChainLinkBesu.sol";

contract LotteryRandomTestBesu is LotteryBase, ChainLinkBesu {

  constructor(
    string memory name,
    address ticketFactory,
    address acceptedToken
  ) LotteryBase(name, ticketFactory, acceptedToken) {}

  function getRandomNumber() internal override(LotteryBase, ChainLinkTest) returns (bytes32 requestId) {
    return super.getRandomNumber();
  }

  function fulfillRandomness(bytes32 random, uint256 randomness) internal override(LotteryBase, VRFConsumerBase) {
    super.fulfillRandomness(random, randomness);
  }
}
