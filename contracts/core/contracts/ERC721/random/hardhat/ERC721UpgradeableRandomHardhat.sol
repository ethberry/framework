// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@gemunion/contracts-chain-link/contracts/extensions/ChainLinkHardhat.sol";

import "../../ERC721UpgradeableRandom.sol";

contract ERC721UpgradeableRandomHardhat is ERC721UpgradeableRandom, ChainLinkHardhat {
  constructor(
    string memory name,
    string memory symbol,
    uint96 royalty,
    string memory baseTokenURI
  ) ERC721UpgradeableRandom(name, symbol, royalty, baseTokenURI) {}

  function getRandomNumber() internal override(ChainLinkBase, ERC721UpgradeableRandom) returns (bytes32 requestId) {
    return super.getRandomNumber();
  }

  function fulfillRandomness(
    bytes32 requestId,
    uint256 randomness
  ) internal override(ERC721UpgradeableRandom, VRFConsumerBase) {
    return super.fulfillRandomness(requestId, randomness);
  }
}
