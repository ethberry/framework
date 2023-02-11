// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@gemunion/contracts-chain-link/contracts/extensions/ChainLinkGoerli.sol";

import "../../ERC721BlacklistRandom.sol";

contract ERC721BlacklistRandomGoerli is ERC721BlacklistRandom, ChainLinkGoerli {
  constructor(
    string memory name,
    string memory symbol,
    uint96 royalty,
    string memory baseTokenURI
  ) ERC721BlacklistRandom(name, symbol, royalty, baseTokenURI) {}

  function getRandomNumber() internal override(ChainLinkBase, ERC721BlacklistRandom) returns (bytes32 requestId) {
    return super.getRandomNumber();
  }

  function fulfillRandomness(
    bytes32 requestId,
    uint256 randomness
  ) internal override(ERC721BlacklistRandom, VRFConsumerBase) {
    return super.fulfillRandomness(requestId, randomness);
  }
}
