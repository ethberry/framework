// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.20;

import {VRFConsumerBaseV2} from "@chainlink/contracts/src/v0.8/vrf/VRFConsumerBaseV2.sol";

import {ChainLinkGemunionV2} from "@gemunion/contracts-chain-link-v2/contracts/extensions/ChainLinkGemunionV2.sol";
import {ChainLinkBaseV2} from "@gemunion/contracts-chain-link-v2/contracts/extensions/ChainLinkBaseV2.sol";

import {ERC998BlacklistRandom} from "../ERC998BlacklistRandom.sol";
import {InvalidSubscription} from "../../utils/errors.sol";

contract ERC998BlacklistRandomGemunion is ERC998BlacklistRandom, ChainLinkGemunionV2 {
  constructor(
    string memory name,
    string memory symbol,
    uint96 royalty,
    string memory baseTokenURI
  )
    ERC998BlacklistRandom(name, symbol, royalty, baseTokenURI)
    ChainLinkGemunionV2(uint64(0), uint16(6), uint32(600000), uint32(1))
  {}

  // OWNER MUST SET A VRF SUBSCRIPTION ID AFTER DEPLOY
  event VrfSubscriptionSet(uint64 subId);
  function setSubscriptionId(uint64 subId) public onlyRole(DEFAULT_ADMIN_ROLE) {
    if (subId == 0) revert InvalidSubscription();
        _subId = subId;
    emit VrfSubscriptionSet(_subId);
  }

  function getRandomNumber() internal override(ChainLinkBaseV2, ERC998BlacklistRandom) returns (uint256 requestId) {
    if (_subId == 0) revert InvalidSubscription();
    return super.getRandomNumber();
  }

  function fulfillRandomWords(
    uint256 requestId,
    uint256[] memory randomWords
  ) internal override(ERC998BlacklistRandom, VRFConsumerBaseV2) {
    return super.fulfillRandomWords(requestId, randomWords);
  }

  /**
   * @dev See {ERC721-_increaseBalance}.
   */
  function _increaseBalance(address account, uint128 amount) internal virtual override {
    super._increaseBalance(account, amount);
  }

  /**
   * @dev See {ERC721-_baseURI}.
   */
  function _baseURI() internal view virtual override returns (string memory) {
    return super._baseURI();
  }
}
