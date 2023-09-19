// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "../ERC721BlacklistRandom.sol";
import "../../MOCKS/ChainLinkBesu.sol";

contract ERC721BlacklistRandomBesu is ERC721BlacklistRandom, ChainLinkBesu {
  constructor(
    string memory name,
    string memory symbol,
    uint96 royalty,
    string memory baseTokenURI
  )
    ERC721BlacklistRandom(name, symbol, royalty, baseTokenURI)
    ChainLinkBesu(uint64(1), uint16(6), uint32(600000), uint32(1))
  {}

  function getRandomNumber() internal override(ChainLinkBase, ERC721BlacklistRandom) returns (uint256 requestId) {
    return super.getRandomNumber();
  }

  function fulfillRandomWords(
    uint256 requestId,
    uint256[] memory randomWords
  ) internal override(ERC721BlacklistRandom, VRFConsumerBaseV2) {
    return super.fulfillRandomWords(requestId, randomWords);
  }
}
