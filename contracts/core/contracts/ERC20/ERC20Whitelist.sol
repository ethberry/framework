// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@gemunion/contracts-access-list/contracts/extension/WhiteList.sol";

import "./ERC20Simple.sol";

contract ERC20Whitelist is ERC20Simple, WhiteList {
  constructor(string memory name, string memory symbol, uint256 cap) ERC20Simple(name, symbol, cap) {}

  function supportsInterface(bytes4 interfaceId) public view virtual override(AccessControl, ERC20AB) returns (bool) {
    return super.supportsInterface(interfaceId);
  }

  function _beforeTokenTransfer(address from, address to, uint256 amount) internal override {
    require(this.isWhitelisted(from), "Whitelist: sender is not whitelisted");
    require(this.isWhitelisted(to), "Whitelist: receiver is not whitelisted");
    super._beforeTokenTransfer(from, to, amount);
  }
}
