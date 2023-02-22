// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@gemunion/contracts-chain-link/contracts/extensions/ChainLinkGemunionV2.sol";

import "../../ERC721BlacklistRandom.sol";

contract ERC721BlacklistRandomGemunion is ERC721BlacklistRandom, ChainLinkGemunionV2 {
  constructor(
    string memory name,
    string memory symbol,
    uint96 royalty,
    string memory baseTokenURI
  ) ERC721BlacklistRandom(name, symbol, royalty, baseTokenURI)
    ChainLinkGemunionV2(uint64(2), uint16(6),uint32(600000),uint32(1))
  {}

  function getRandomNumber() internal override(ChainLinkBaseV2, ERC721BlacklistRandom) returns (uint256 requestId) {
    return super.getRandomNumber();
  }

  function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal override(ERC721BlacklistRandom, VRFConsumerBaseV2) {
    return super.fulfillRandomWords(requestId, randomWords);
  }
}
