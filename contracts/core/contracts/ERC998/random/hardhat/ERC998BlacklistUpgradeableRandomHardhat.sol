// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@gemunion/contracts-chain-link/contracts/extensions/ChainLinkHardhat.sol";

import "../../ERC998BlacklistUpgradeableRandom.sol";

contract ERC998BlacklistUpgradeableRandomHardhat is ERC998BlacklistUpgradeableRandom, ChainLinkHardhat {
  constructor(
    string memory name,
    string memory symbol,
    uint96 royalty,
    string memory baseTokenURI
  ) ERC998BlacklistUpgradeableRandom(name, symbol, royalty, baseTokenURI) {}

  function getRandomNumber()
    internal
    override(ChainLinkBase, ERC998BlacklistUpgradeableRandom)
    returns (bytes32 requestId)
  {
    return super.getRandomNumber();
  }

  function fulfillRandomness(
    bytes32 requestId,
    uint256 randomness
  ) internal override(ERC998BlacklistUpgradeableRandom, VRFConsumerBase) {
    return super.fulfillRandomness(requestId, randomness);
  }
}
