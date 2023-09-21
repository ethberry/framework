// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "../../MOCKS/ChainLinkBesu.sol";

import "../ERC998BlacklistDiscreteRandom.sol";

contract ERC998BlacklistDiscreteRandomBesu is ERC998BlacklistDiscreteRandom, ChainLinkBesu {
  constructor(
    string memory name,
    string memory symbol,
    uint96 royalty,
    string memory baseTokenURI
  )
    ERC998BlacklistDiscreteRandom(name, symbol, royalty, baseTokenURI)
    ChainLinkBesu(uint64(1), uint16(6), uint32(600000), uint32(1))
  {}

  function getRandomNumber()
    internal
    override(ChainLinkBaseV2, ERC998BlacklistDiscreteRandom)
    returns (uint256 requestId)
  {
    return super.getRandomNumber();
  }

  function fulfillRandomWords(
    uint256 requestId,
    uint256[] memory randomWords
  ) internal override(ERC998BlacklistDiscreteRandom, VRFConsumerBaseV2) {
    return super.fulfillRandomWords(requestId, randomWords);
  }
}
