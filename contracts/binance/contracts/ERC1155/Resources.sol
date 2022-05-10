// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.4;

import "@gemunion/contracts/contracts/ERC1155/preset/ERC1155ACBS.sol";
import "@gemunion/contracts/contracts/ERC1155/ERC1155BaseUrl.sol";

contract Resources is ERC1155ACBS, ERC1155BaseUrl {
  constructor(string memory baseTokenURI) ERC1155ACBS(baseTokenURI) {}

  function uri(uint256 tokenId) public view virtual override returns (string memory) {
    return url(super.uri(tokenId));
  }
}
