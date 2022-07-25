// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "@gemunion/contracts/contracts/ERC1155/preset/ERC1155ACBSR.sol";
import "@gemunion/contracts/contracts/ERC1155/ERC1155BaseUrl.sol";

contract ERC1155Simple is ERC1155ACBSR, ERC1155BaseUrl {
  constructor(uint96 royaltyNumerator, string memory baseTokenURI) ERC1155ACBSR(royaltyNumerator, baseTokenURI) {}

  function uri(uint256 tokenId) public view virtual override returns (string memory) {
    return url(super.uri(tokenId));
  }
}
