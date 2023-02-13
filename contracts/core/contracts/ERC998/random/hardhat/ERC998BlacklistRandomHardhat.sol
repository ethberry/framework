// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@gemunion/contracts-chain-link/contracts/extensions/ChainLinkHardhat.sol";

import "../../ERC998BlacklistRandom.sol";

contract ERC998BlacklistRandomHardhat is ERC998BlacklistRandom, ChainLinkHardhat {
  constructor(
    string memory name,
    string memory symbol,
    uint96 royalty,
    string memory baseTokenURI
  ) ERC998BlacklistRandom(name, symbol, royalty, baseTokenURI) {}

  function getRandomNumber() internal override(ChainLinkBase, ERC998BlacklistRandom) returns (bytes32 requestId) {
    return super.getRandomNumber();
  }

  function fulfillRandomness(
    bytes32 requestId,
    uint256 randomness
  ) internal override(ERC998BlacklistRandom, VRFConsumerBase) {
    return super.fulfillRandomness(requestId, randomness);
  }
}
