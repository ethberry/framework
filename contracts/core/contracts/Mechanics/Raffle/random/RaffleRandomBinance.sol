// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.20;

import {VRFConsumerBaseV2} from "@chainlink/contracts/src/v0.8/vrf/VRFConsumerBaseV2.sol";

import {ChainLinkBinanceV2} from "@gemunion/contracts-chain-link-v2/contracts/extensions/ChainLinkBinanceV2.sol";
import {ChainLinkBaseV2} from "@gemunion/contracts-chain-link-v2/contracts/extensions/ChainLinkBaseV2.sol";

import {RaffleRandom} from "../RaffleRandom.sol";
import {Asset} from "../../../Exchange/lib/interfaces/IAsset.sol";
import {InvalidSubscription} from "../../../utils/errors.sol";

contract RaffleRandomBinance is RaffleRandom, ChainLinkBinanceV2 {
  constructor() RaffleRandom() ChainLinkBinanceV2(uint64(0), uint16(6), uint32(600000), uint32(1)) {}

  // OWNER MUST SET A VRF SUBSCRIPTION ID AFTER DEPLOY
  event VrfSubscriptionSet(uint64 subId);
  function setSubscriptionId(uint64 subId) public onlyRole(DEFAULT_ADMIN_ROLE) {
    if (subId == 0) {
      revert InvalidSubscription();
    }
    _subId = subId;
    emit VrfSubscriptionSet(_subId);
  }

  function getRandomNumber() internal override(RaffleRandom, ChainLinkBaseV2) returns (uint256 requestId) {
    if (_subId == 0) {
      revert InvalidSubscription();
    }
    return super.getRandomNumber();
  }

  function fulfillRandomWords(
    uint256 requestId,
    uint256[] memory randomWords
  ) internal override(RaffleRandom, VRFConsumerBaseV2) {
    return super.fulfillRandomWords(requestId, randomWords);
  }
}
