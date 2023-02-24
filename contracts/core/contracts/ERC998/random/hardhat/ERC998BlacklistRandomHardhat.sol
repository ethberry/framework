// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@gemunion/contracts-chain-link/contracts/extensions/ChainLinkHardhatV2.sol";

import "../../ERC998BlacklistRandom.sol";

contract ERC998BlacklistRandomHardhat is ERC998BlacklistRandom, ChainLinkHardhatV2 {
  constructor(
    string memory name,
    string memory symbol,
    uint96 royalty,
    string memory baseTokenURI
  ) ERC998BlacklistRandom(name, symbol, royalty, baseTokenURI) {}

  function getRandomNumber() internal override(ChainLinkBaseV2, ERC998BlacklistRandom) returns (uint256 requestId) {
    return super.getRandomNumber();
  }

  function fulfillRandomWords(
    uint256 requestId,
    uint256[] memory randomWords
  ) internal override(ERC998BlacklistRandom, VRFConsumerBaseV2) {
    return super.fulfillRandomWords(requestId, randomWords);
  }
}
