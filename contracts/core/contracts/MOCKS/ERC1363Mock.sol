// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@gemunion/contracts-erc1363/contracts/extensions/ERC1363.sol";

import "@gemunion/contracts-misc/contracts/constants.sol";

contract ERC1363Mock is AccessControl, ERC1363 {
  constructor(string memory name, string memory symbol) ERC20(name, symbol) {
    _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
    _setupRole(MINTER_ROLE, _msgSender());
  }

  function _mint(address account, uint256 amount) internal virtual override {
    super._mint(account, amount);
  }

  function mint(address to, uint256 amount) public virtual onlyRole(DEFAULT_ADMIN_ROLE) {
    _mint(to, amount);
  }

  function supportsInterface(bytes4 interfaceId) public view virtual override(AccessControl, ERC1363) returns (bool) {
    return super.supportsInterface(interfaceId);
  }
}
