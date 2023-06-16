// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@gemunion/contracts-access-list/contracts/extension/BlackList.sol";

import "./ERC721CSimple.sol";

contract ERC721CBlacklist is ERC721CSimple, BlackList {
  constructor(
    string memory name,
    string memory symbol,
    uint96 royalty,
    string memory baseTokenURI,
    uint96 batchSize,
    address owner
  ) ERC721CSimple(name, symbol, royalty, baseTokenURI, batchSize, owner) {}

  function supportsInterface(
    bytes4 interfaceId
  ) public view virtual override(AccessControl, ERC721CSimple) returns (bool) {
    return super.supportsInterface(interfaceId);
  }

  function _beforeTokenTransfer(address from, address to, uint256 firstTokenId, uint256 batchSize) internal override {
    require(from == address(0) || !_isBlacklisted(from), "Blacklist: sender is blacklisted");
    require(to == address(0) || !_isBlacklisted(to), "Blacklist: receiver is blacklisted");
    super._beforeTokenTransfer(from, to, firstTokenId, batchSize);
  }
}
