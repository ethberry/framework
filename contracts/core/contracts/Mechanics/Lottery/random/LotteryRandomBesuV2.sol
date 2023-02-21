// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "../LotteryRandomV2.sol";
import "../../../MOCKS/ChainLinkBesuV2.sol";

contract LotteryRandomBesuV2 is LotteryRandomV2, ChainLinkBesuV2 {
  constructor(
    string memory name,
    address ticketFactory,
    address acceptedToken
  ) LotteryRandomV2(name, ticketFactory, acceptedToken)
    ChainLinkBesuV2(uint64(1), uint16(6),uint32(600000),uint32(1))
  {}

  function getRandomNumber() internal override(LotteryRandomV2, ChainLinkBaseV2) returns (uint256 requestId) {
    return super.getRandomNumber();
  }

  function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal
  override(LotteryRandomV2, VRFConsumerBaseV2) {
    return super.fulfillRandomWords(requestId, randomWords);
  }

  function setDummyRound(
    bool[] calldata ticket,
    uint8[6] calldata values,
    uint8[7] calldata aggregation,
    uint256 requestId
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
