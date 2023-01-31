// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

contract Breed {
  // TODO all uint32 ??
  struct Genes {
    int256 strength;
    int256 dexterity;
    int256 constitution;
    int256 intelligence;
    int256 wisdom;
    int256 charisma;
  }

  function encodeNumbers(Genes memory genes) public pure returns (uint256 encoded) {
    encoded |= uint256(uint32(int32(genes.strength))) << 160;
    encoded |= uint256(uint32(int32(genes.dexterity))) << 128;
    encoded |= uint256(uint32(int32(genes.constitution))) << 96;
    encoded |= uint256(uint32(int32(genes.intelligence))) << 64;
    encoded |= uint256(uint32(int32(genes.wisdom))) << 32;
    encoded |= uint256(uint32(int32(genes.charisma))) << 0;
  }

  function decodeNumber(uint256 encoded) public pure returns (Genes memory genes) {
    genes = Genes(
      int256(int32(uint32(encoded >> 160))),
      int256(int32(uint32(encoded >> 128))),
      int256(int32(uint32(encoded >> 96))),
      int256(int32(uint32(encoded >> 64))),
      int256(int32(uint32(encoded >> 32))),
      int256(int32(uint32(encoded >> 0)))
    );
  }
}
