// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@gemunion/contracts-access-list/contracts/extension/BlackList.sol";

import "./ERC20Simple.sol";

contract ERC20Blacklist is ERC20Simple, BlackList {
  constructor(string memory name, string memory symbol, uint256 cap) ERC20Simple(name, symbol, cap) {}

  /**
   * @dev See {IERC165-supportsInterface}.
   */
  function supportsInterface(bytes4 interfaceId) public view virtual override(AccessControl, ERC20AB) returns (bool) {
    return super.supportsInterface(interfaceId);
  }

  /**
   * @dev See {ERC20-_beforeTokenTransfer}.
   * Override that checks the access list
   */
  function _beforeTokenTransfer(address from, address to, uint256 amount) internal override {
    require(from == address(0) || !_isBlacklisted(from), "Blacklist: sender is blacklisted");
    require(to == address(0) || !_isBlacklisted(to), "Blacklist: receiver is blacklisted");
    super._beforeTokenTransfer(from, to, amount);
  }
}
