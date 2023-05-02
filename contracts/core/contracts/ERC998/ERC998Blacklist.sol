// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/utils/Counters.sol";

import "@gemunion/contracts-access-list/contracts/extension/BlackList.sol";

import "./ERC998Simple.sol";

contract ERC998Blacklist is ERC998Simple, BlackList {
  using Counters for Counters.Counter;

  constructor(
    string memory name,
    string memory symbol,
    uint96 royalty,
    string memory baseTokenURI
  ) ERC998Simple(name, symbol, royalty, baseTokenURI) {}

  function supportsInterface(
    bytes4 interfaceId
  ) public view virtual override(AccessControl, ERC998Simple) returns (bool) {
    return super.supportsInterface(interfaceId);
  }

  function _beforeTokenTransfer(address from, address to, uint256 firstTokenId, uint256 batchSize) internal override {
    require(from == address(0) || !this.isBlacklisted(from), "Blacklist: sender is blacklisted");
    require(to == address(0) || !this.isBlacklisted(to), "Blacklist: receiver is blacklisted");
    super._beforeTokenTransfer(from, to, firstTokenId, batchSize);
  }
}
