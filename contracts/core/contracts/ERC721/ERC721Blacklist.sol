// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Counters.sol";

import "@gemunion/contracts/contracts/AccessList/BlackList.sol";

import "./ERC721Simple.sol";

contract ERC721Blacklist is ERC721Simple, BlackList {
  using Counters for Counters.Counter;

  constructor(
    string memory name,
    string memory symbol,
    uint96 royalty,
    string memory baseTokenURI
  ) ERC721Simple(name, symbol, royalty, baseTokenURI) {}

  function supportsInterface(bytes4 interfaceId)
    public
    view
    virtual
    override(AccessControl, ERC721Simple)
    returns (bool)
  {
    return super.supportsInterface(interfaceId);
  }

  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 amount
  ) internal override {
    require(!this.isBlacklisted(from), "Blacklist: sender is blacklisted");
    require(!this.isBlacklisted(to), "Blacklist: receiver is blacklisted");
    super._beforeTokenTransfer(from, to, amount);
  }
}
