// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@gemunion/contracts-chain-link-v2/contracts/extensions/ChainLinkHardhat.sol";

import "../ERC998BlacklistRandom.sol";

contract ERC998BlacklistRandomHardhat is ERC998BlacklistRandom, ChainLinkHardhat {
  constructor(
    string memory name,
    string memory symbol,
    uint96 royalty,
    string memory baseTokenURI
  )
    ERC998BlacklistRandom(name, symbol, royalty, baseTokenURI)
    ChainLinkHardhat(uint64(1), uint16(6), uint32(600000), uint32(1))
  {}

  function getRandomNumber() internal override(ChainLinkBase, ERC998BlacklistRandom) returns (uint256 requestId) {
    return super.getRandomNumber();
  }

  function fulfillRandomWords(
    uint256 requestId,
    uint256[] memory randomWords
  ) internal override(ERC998BlacklistRandom, VRFConsumerBaseV2) {
    return super.fulfillRandomWords(requestId, randomWords);
  }
}