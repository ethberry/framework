// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@gemunion/contracts-chain-link-v2/contracts/extensions/ChainLinkHardhat.sol";

import "../LotteryRandom.sol";

contract LotteryRandomHardhat is LotteryRandom, ChainLinkHardhat {
  constructor(
    Lottery memory config
  ) LotteryRandom(config) ChainLinkHardhat(uint64(1), uint16(6), uint32(600000), uint32(1)) {}

  function getRandomNumber() internal override(LotteryRandom, ChainLinkBase) returns (uint256 requestId) {
    return super.getRandomNumber();
  }

  function fulfillRandomWords(
    uint256 requestId,
    uint256[] memory randomWords
  ) internal override(LotteryRandom, VRFConsumerBaseV2) {
    return super.fulfillRandomWords(requestId, randomWords);
  }

  function setDummyRound(
    bytes32 ticket,
    uint8[6] calldata values,
    uint8[7] calldata aggregation,
    uint256 requestId,
    Asset memory item,
    Asset memory price,
    uint256 maxTicket
  ) external {
    Round memory dummyRound;
    _rounds.push(dummyRound);

    uint256 roundNumber = _rounds.length - 1;
    Round storage currentRound = _rounds[roundNumber];

    currentRound.maxTicket = maxTicket;
    currentRound.startTimestamp = block.timestamp;
    currentRound.endTimestamp = block.timestamp + 1;
    currentRound.balance = 10000 ether;
    currentRound.total = 10000 ether;
    currentRound.total -= (currentRound.total * comm) / 100;
    currentRound.tickets.push(ticket);
    currentRound.values = values;
    currentRound.ticketAsset = item;
    currentRound.acceptedAsset = price;
    // prize numbers
    currentRound.aggregation = aggregation;
    currentRound.requestId = requestId;
  }

  function setDummyTicket(bytes32 ticket) external {
    uint256 roundNumber = _rounds.length - 1;
    Round storage currentRound = _rounds[roundNumber];
    currentRound.tickets.push(ticket);
  }
}
