// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@gemunion/contracts-access-list/contracts/extension/BlackList.sol";

import "./ERC721Simple.sol";

contract ERC721Blacklist is ERC721Simple, BlackList {
  constructor(
    string memory name,
    string memory symbol,
    uint96 royalty,
    string memory baseTokenURI
  ) ERC721Simple(name, symbol, royalty, baseTokenURI) {}

  /**
   * @dev See {IERC165-supportsInterface}.
   */
  function supportsInterface(
    bytes4 interfaceId
  ) public view virtual override(AccessControl, ERC721Simple) returns (bool) {
    return super.supportsInterface(interfaceId);
  }

  /**
   * @dev See {ERC721-_beforeTokenTransfer}.
   * Override that checks the access list
   */
  function _beforeTokenTransfer(address from, address to, uint256 firstTokenId, uint256 batchSize) internal override {
    require(from == address(0) || !_isBlacklisted(from), "Blacklist: sender is blacklisted");
    require(to == address(0) || !_isBlacklisted(to), "Blacklist: receiver is blacklisted");
    super._beforeTokenTransfer(from, to, firstTokenId, batchSize);
  }
}
