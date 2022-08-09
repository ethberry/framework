// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "@gemunion/contracts/contracts/AccessList/BlackList.sol";

import "./ERC721Random.sol";

contract ERC721RandomBlacklist is ERC721Random, BlackList {
  constructor(
    string memory name,
    string memory symbol,
    uint96 royalty,
    string memory baseTokenURI
  ) ERC721Random(name, symbol, royalty, baseTokenURI) {}

  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 amount
  ) internal override {
    require(!this.isBlacklisted(from), "ERC721: sender is blacklisted");
    require(!this.isBlacklisted(to), "ERC721: receiver is blacklisted");
    super._beforeTokenTransfer(from, to, amount);
  }

  function supportsInterface(bytes4 interfaceId)
    public
    view
    virtual
    override(AccessControl, ERC721Random)
    returns (bool)
  {
    return super.supportsInterface(interfaceId);
  }
}
