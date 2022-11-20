// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "@gemunion/contracts-access-list/contracts/extension/BlackList.sol";

import "./ERC998Random.sol";

contract ERC998RandomBlacklist is ERC998Random, BlackList {
  constructor(
    string memory name,
    string memory symbol,
    uint96 royalty,
    string memory baseTokenURI
  ) ERC998Random(name, symbol, royalty, baseTokenURI) {}

  function _beforeTokenTransfer(address from, address to, uint256 firstTokenId, uint256 batchSize) internal override {
    require(!this.isBlacklisted(from), "Blacklist: sender is blacklisted");
    require(!this.isBlacklisted(to), "Blacklist: receiver is blacklisted");
    super._beforeTokenTransfer(from, to, firstTokenId, batchSize);
  }

  function supportsInterface(
    bytes4 interfaceId
  ) public view virtual override(AccessControl, ERC998Random) returns (bool) {
    return super.supportsInterface(interfaceId);
  }
}
