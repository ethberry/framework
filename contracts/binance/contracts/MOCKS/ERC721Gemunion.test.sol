// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.4;

import "@gemunion/contracts/contracts/ERC721/preset/ERC721ACBCE.sol";

contract ERC721GemunionTest is ERC721ACBCE {
  constructor(
    string memory name,
    string memory symbol,
    string memory baseTokenURI
  ) ERC721ACBCE(name, symbol, baseTokenURI, 2) {}
}
