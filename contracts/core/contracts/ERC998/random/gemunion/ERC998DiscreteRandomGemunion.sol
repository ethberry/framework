// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@gemunion/contracts-chain-link-v2/contracts/extensions/ChainLinkGemunion.sol";

import "../../ERC998DiscreteRandom.sol";

contract ERC998DiscreteRandomGemunion is ERC998DiscreteRandom, ChainLinkGemunion {
  constructor(
    string memory name,
    string memory symbol,
    uint96 royalty,
    string memory baseTokenURI
  )
    ERC998DiscreteRandom(name, symbol, royalty, baseTokenURI)
    ChainLinkGemunion(uint64(2), uint16(6), uint32(600000), uint32(1))
  {}

  function getRandomNumber() internal override(ChainLinkBase, ERC998DiscreteRandom) returns (uint256 requestId) {
    return super.getRandomNumber();
  }

  function fulfillRandomWords(
    uint256 requestId,
    uint256[] memory randomWords
  ) internal override(ERC998DiscreteRandom, VRFConsumerBaseV2) {
    return super.fulfillRandomWords(requestId, randomWords);
  }
}
