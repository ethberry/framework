// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@gemunion/contracts-chain-link-v2/contracts/extensions/ChainLinkGoerli.sol";

import "../ERC721DiscreteRandom.sol";

contract ERC721DiscreteRandomGoerli is ERC721DiscreteRandom, ChainLinkGoerli {
  constructor(
    string memory name,
    string memory symbol,
    uint96 royalty,
    string memory baseTokenURI
  )
    ERC721DiscreteRandom(name, symbol, royalty, baseTokenURI)
    ChainLinkGoerli(uint64(1), uint16(6), uint32(600000), uint32(1))
  {}

  function getRandomNumber() internal override(ChainLinkBase, ERC721DiscreteRandom) returns (uint256 requestId) {
    return super.getRandomNumber();
  }

  function fulfillRandomWords(
    uint256 requestId,
    uint256[] memory randomWords
  ) internal override(ERC721DiscreteRandom, VRFConsumerBaseV2) {
    return super.fulfillRandomWords(requestId, randomWords);
  }
}
