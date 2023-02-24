// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@gemunion/contracts-chain-link/contracts/extensions/ChainLinkGoerliV2.sol";

import "../../ERC721BlacklistUpgradeableRandom.sol";

contract ERC721BlacklistUpgradeableRandomGoerli is ERC721BlacklistUpgradeableRandom, ChainLinkGoerliV2 {
  constructor(
    string memory name,
    string memory symbol,
    uint96 royalty,
    string memory baseTokenURI
  )
    ERC721BlacklistUpgradeableRandom(name, symbol, royalty, baseTokenURI)
    ChainLinkGoerliV2(uint64(1), uint16(6), uint32(600000), uint32(1))
  {}

  function getRandomNumber()
    internal
    override(ChainLinkBaseV2, ERC721BlacklistUpgradeableRandom)
    returns (uint256 requestId)
  {
    return super.getRandomNumber();
  }

  function fulfillRandomWords(
    uint256 requestId,
    uint256[] memory randomWords
  ) internal override(ERC721BlacklistUpgradeableRandom, VRFConsumerBaseV2) {
    return super.fulfillRandomWords(requestId, randomWords);
  }
}
