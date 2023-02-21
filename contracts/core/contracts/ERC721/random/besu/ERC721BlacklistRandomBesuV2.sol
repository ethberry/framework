// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "../../ERC721BlacklistRandomV2.sol";
import "../../../MOCKS/ChainLinkBesuV2.sol";

contract ERC721BlacklistRandomBesuV2 is ERC721BlacklistRandomV2, ChainLinkBesuV2 {
  constructor(
    string memory name,
    string memory symbol,
    uint96 royalty,
    string memory baseTokenURI
  ) ERC721BlacklistRandomV2(name, symbol, royalty, baseTokenURI)
    ChainLinkBesuV2(uint64(1), uint16(6),uint32(600000),uint32(1))
  {}

  function getRandomNumber() internal override(ChainLinkBaseV2, ERC721BlacklistRandomV2) returns (uint256 requestId) {
    return super.getRandomNumber();
  }

  function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal
  override(ERC721BlacklistRandomV2, VRFConsumerBaseV2) {
    return super.fulfillRandomWords(requestId, randomWords);
  }
}
