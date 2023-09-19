// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "./ERC721Simple.sol";

contract ERC721Soulbound is ERC721Simple {
  constructor(
    string memory name,
    string memory symbol,
    uint96 royalty,
    string memory baseTokenURI
  ) ERC721Simple(name, symbol, royalty, baseTokenURI) {}

  /**
   * @dev See {ERC721-_beforeTokenTransfer}.
   * Override that disables transfer
   */
  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 firstTokenId,
    uint256 batchSize
  ) internal virtual override {
    require(from == address(0) || to == address(0), "ERC721Soulbound: can't be transferred");
    super._beforeTokenTransfer(from, to, firstTokenId, batchSize);
  }
}
