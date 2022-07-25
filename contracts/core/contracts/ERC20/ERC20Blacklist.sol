// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "@gemunion/contracts/contracts/AccessList/BlackList.sol";

import "./ERC20Simple.sol";

contract ERC20Blacklist is ERC20Simple, BlackList {
  constructor(
    string memory name,
    string memory symbol,
    uint256 cap
  ) ERC20Simple(name, symbol, cap) {}

  function supportsInterface(bytes4 interfaceId) public view virtual override(AccessControl, ERC20ACB) returns (bool) {
    return super.supportsInterface(interfaceId);
  }

  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 amount
  ) internal override {
    require(!this.isBlacklisted(from), "ERC20Blacklist: sender is BlackListed");
    require(!this.isBlacklisted(to), "ERC20Blacklist: receiver is BlackListed");
    super._beforeTokenTransfer(from, to, amount);
  }
}
