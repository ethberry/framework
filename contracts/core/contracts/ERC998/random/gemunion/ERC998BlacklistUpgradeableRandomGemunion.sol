// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@gemunion/contracts-chain-link/contracts/extensions/ChainLinkGemunionV2.sol";

import "../../ERC998BlacklistUpgradeableRandom.sol";

contract ERC998BlacklistUpgradeableRandomGemunion is ERC998BlacklistUpgradeableRandom, ChainLinkGemunionV2 {
  constructor(
    string memory name,
    string memory symbol,
    uint96 royalty,
    string memory baseTokenURI
  ) ERC998BlacklistUpgradeableRandom(name, symbol, royalty, baseTokenURI)
  ChainLinkGemunionV2(uint64(2), uint16(6),uint32(600000),uint32(1))
  {}

  function getRandomNumber() internal override(ChainLinkBaseV2, ERC998BlacklistUpgradeableRandom) returns (uint256 requestId) {
    return super.getRandomNumber();
  }

  function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal
  override(ERC998BlacklistUpgradeableRandom, VRFConsumerBaseV2) {
    return super.fulfillRandomWords(requestId, randomWords);
  }
}
