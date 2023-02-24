// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@gemunion/contracts-chain-link/contracts/extensions/ChainLinkGemunionV2.sol";

import "../../ERC721UpgradeableRandom.sol";

contract ERC721UpgradeableRandomGemunion is ERC721UpgradeableRandom, ChainLinkGemunionV2 {
  constructor(
    string memory name,
    string memory symbol,
    uint96 royalty,
    string memory baseTokenURI
  )
    ERC721UpgradeableRandom(name, symbol, royalty, baseTokenURI)
    ChainLinkGemunionV2(uint64(2), uint16(6), uint32(600000), uint32(1))
  {}

  function getRandomNumber() internal override(ChainLinkBaseV2, ERC721UpgradeableRandom) returns (uint256 requestId) {
    return super.getRandomNumber();
  }

  function fulfillRandomWords(
    uint256 requestId,
    uint256[] memory randomWords
  ) internal override(ERC721UpgradeableRandom, VRFConsumerBaseV2) {
    return super.fulfillRandomWords(requestId, randomWords);
  }
}
