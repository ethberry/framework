// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

contract Breed {
  struct Genes {
    uint32 strength;
    uint32 dexterity;
    uint32 constitution;
    uint32 intelligence;
    uint32 wisdom;
    uint32 charisma;
  }

  function encodeNumbers(Genes memory genes) public pure returns (uint256 encoded) {
    encoded |= uint256(genes.strength) << 160;
    encoded |= uint256(genes.dexterity) << 128;
    encoded |= uint256(genes.constitution) << 96;
    encoded |= uint256(genes.intelligence) << 64;
    encoded |= uint256(genes.wisdom) << 32;
    encoded |= uint256(genes.charisma) << 0;
  }

  function decodeNumber(uint256 encoded) public pure returns (Genes memory genes) {
    genes = Genes(
      uint32(encoded >> 160),
      uint32(encoded >> 128),
      uint32(encoded >> 96),
      uint32(encoded >> 64),
      uint32(encoded >> 32),
      uint32(encoded >> 0)
    );
  }
}
