// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@gemunion/contracts-chain-link/contracts/extensions/ChainLinkGemunion.sol";

import "../../ERC998UpgradeableRandom.sol";

contract ERC998UpgradeableRandomGemunion is ERC998UpgradeableRandom, ChainLinkGemunion {
  constructor(
    string memory name,
    string memory symbol,
    uint96 royalty,
    string memory baseTokenURI
  ) ERC998UpgradeableRandom(name, symbol, royalty, baseTokenURI) {}

  function getRandomNumber() internal override(ChainLinkBase, ERC998UpgradeableRandom) returns (bytes32 requestId) {
    return super.getRandomNumber();
  }

  function fulfillRandomness(
    bytes32 requestId,
    uint256 randomness
  ) internal override(ERC998UpgradeableRandom, VRFConsumerBase) {
    return super.fulfillRandomness(requestId, randomness);
  }
}
