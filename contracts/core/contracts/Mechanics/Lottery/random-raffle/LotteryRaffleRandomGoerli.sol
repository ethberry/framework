// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@gemunion/contracts-chain-link-v2/contracts/extensions/ChainLinkGoerli.sol";

import "../LotteryRaffleRandom.sol";

contract LotteryRaffleRandomGoerli is LotteryRaffleRandom, ChainLinkGoerli {
  using Counters for Counters.Counter;

  constructor(
    string memory name,
    Lottery memory config
  ) LotteryRaffleRandom(name, config) ChainLinkGoerli(uint64(1), uint16(6), uint32(600000), uint32(1)) {}

  function getRandomNumber() internal override(LotteryRaffleRandom, ChainLinkBase) returns (uint256 requestId) {
    return super.getRandomNumber();
  }

  function fulfillRandomWords(
    uint256 requestId,
    uint256[] memory randomWords
  ) internal override(LotteryRaffleRandom, VRFConsumerBaseV2) {
    return super.fulfillRandomWords(requestId, randomWords);
  }

  function setDummyRound(uint256 prizeNumber, uint256 requestId, Asset memory item, Asset memory price) external {
    Round memory dummyRound;
    _rounds.push(dummyRound);

    uint256 roundNumber = _rounds.length - 1;
    Round storage currentRound = _rounds[roundNumber];

    currentRound.roundId = roundNumber;
    currentRound.startTimestamp = block.timestamp;
    currentRound.endTimestamp = block.timestamp + 1;
    currentRound.balance = 10000 ether;
    currentRound.total = 10000 ether;
    currentRound.total -= (currentRound.total * comm) / 100;
    currentRound.ticketCounter.increment();
    currentRound.ticketAsset = item;
    currentRound.acceptedAsset = price;
    // prize numbers
    currentRound.prizeNumber = prizeNumber;
    currentRound.requestId = requestId;
  }
}
