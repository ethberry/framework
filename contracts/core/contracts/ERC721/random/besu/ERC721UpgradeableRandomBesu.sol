// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "../../ERC721UpgradeableRandom.sol";
import "../../../MOCKS/ChainLinkBesuV2.sol";

contract ERC721UpgradeableRandomBesu is ERC721UpgradeableRandom, ChainLinkBesuV2 {
  constructor(
    string memory name,
    string memory symbol,
    uint96 royalty,
    string memory baseTokenURI
  )
    ERC721UpgradeableRandom(name, symbol, royalty, baseTokenURI)
    ChainLinkBesuV2(uint64(1), uint16(6), uint32(600000), uint32(1))
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
