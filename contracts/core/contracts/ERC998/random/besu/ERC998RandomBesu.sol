// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@gemunion/contracts-chain-link/contracts/extensions/ChainLinkBesu.sol";

import "../../ERC998Random.sol";

contract ERC998RandomBesu is ERC998Random, ChainLinkBesu {
  constructor(
    string memory name,
    string memory symbol,
    uint96 royalty,
    string memory baseTokenURI
  ) ERC998Random(name, symbol, royalty, baseTokenURI) {}

  function getRandomNumber() internal override(ChainLinkBase, ERC998Random) returns (bytes32 requestId) {
    return super.getRandomNumber();
  }

  function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override(ERC998Random, VRFConsumerBase) {
    return super.fulfillRandomness(requestId, randomness);
  }
}
