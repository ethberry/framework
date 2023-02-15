// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@gemunion/contracts-chain-link/contracts/extensions/ChainLinkGoerli.sol";

import "../ERC998Genes.sol";

contract ERC998GenesGoerli is ERC998Genes, ChainLinkGoerli {
  constructor(
    string memory name,
    string memory symbol,
    uint96 royalty,
    string memory baseTokenURI
  ) ERC998Genes(name, symbol, royalty, baseTokenURI) {}

  function getRandomNumber() internal override(ChainLinkBase, ERC998Genes) returns (bytes32 requestId) {
    return super.getRandomNumber();
  }

  function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override(ERC998Genes, VRFConsumerBase) {
    return super.fulfillRandomness(requestId, randomness);
  }
}
