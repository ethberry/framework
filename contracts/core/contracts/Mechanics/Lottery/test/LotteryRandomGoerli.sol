// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "../LotteryBase.sol";
import "../../../MOCKS/ChainLink/ChainLinkGoerliTest.sol";

contract LotteryRandomGoerli is LotteryBase, ChainLinkGoerliTest {

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

  function setDummyRound(
    bool[] calldata ticket,
    uint8[6] calldata values,
    uint8[7] calldata aggregation,
    bytes32 requestId
  ) external {
    Round memory dummyRound;
    _rounds.push(dummyRound);

    uint256 roundNumber = _rounds.length - 1;
    Round storage currentRound = _rounds[roundNumber];

    currentRound.startTimestamp = block.timestamp;
    currentRound.endTimestamp = block.timestamp + 1;
    currentRound.balance = 10000 ether;
    currentRound.total = 10000 ether;
    currentRound.total -= (currentRound.total * comm) / 100;
    currentRound.tickets.push(ticket);
    currentRound.values = values;
    // prize numbers
    currentRound.aggregation = aggregation;
    currentRound.requestId = requestId;
  }

  function setDummyTicket(bool[] calldata ticket) external {
    uint256 roundNumber = _rounds.length - 1;
    Round storage currentRound = _rounds[roundNumber];
    currentRound.tickets.push(ticket);
  }
}
