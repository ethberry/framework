// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.20;

import {VRFConsumerBaseV2} from "@chainlink/contracts/src/v0.8/vrf/VRFConsumerBaseV2.sol";

import {ChainLinkHardhatV2} from "@gemunion/contracts-chain-link-v2/contracts/extensions/ChainLinkHardhatV2.sol";
import {ChainLinkBaseV2} from "@gemunion/contracts-chain-link-v2/contracts/extensions/ChainLinkBaseV2.sol";

import {LotteryRandom} from "../LotteryRandom.sol";
import {LotteryConfig} from "../interfaces/ILottery.sol";
import {InvalidSubscription} from "../../../utils/errors.sol";
import {Asset} from "../../../Exchange/lib/interfaces/IAsset.sol";

contract LotteryRandomHardhat is LotteryRandom, ChainLinkHardhatV2 {
  constructor(
    LotteryConfig memory config
  ) LotteryRandom(config) ChainLinkHardhatV2(uint64(0), uint16(6), uint32(600000), uint32(1)) {}

  // OWNER MUST SET A VRF SUBSCRIPTION ID AFTER DEPLOY
  event VrfSubscriptionSet(uint64 subId);
  function setSubscriptionId(uint64 subId) public onlyRole(DEFAULT_ADMIN_ROLE) {
    if (subId == 0) revert InvalidSubscription();
        _subId = subId;
    emit VrfSubscriptionSet(_subId);
  }

  function getRandomNumber() internal override(LotteryRandom, ChainLinkBaseV2) returns (uint256 requestId) {
    if (_subId == 0) revert InvalidSubscription();
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
