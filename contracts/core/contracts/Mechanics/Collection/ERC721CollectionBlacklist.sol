// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@gemunion/contracts-access-list/contracts/extension/BlackList.sol";

import "./ERC721CollectionSimple.sol";

contract ERC721CollectionBlacklist is ERC721CollectionSimple, BlackList {
  constructor(
    string memory name,
    string memory symbol,
    uint96 royalty,
    string memory baseTokenURI,
    uint96 batchSize,
    address owner
  ) ERC721CollectionSimple(name, symbol, royalty, baseTokenURI, batchSize, owner) {}

  function supportsInterface(
    bytes4 interfaceId
  ) public view virtual override(AccessControl, ERC721CollectionSimple) returns (bool) {
    return super.supportsInterface(interfaceId);
  }

  function _beforeTokenTransfer(address from, address to, uint256 firstTokenId, uint256 batchSize) internal override {
    require(from == address(0) || !this.isBlacklisted(from), "Blacklist: sender is blacklisted");
    require(to == address(0) || !this.isBlacklisted(to), "Blacklist: receiver is blacklisted");
    super._beforeTokenTransfer(from, to, firstTokenId, batchSize);
  }
}
