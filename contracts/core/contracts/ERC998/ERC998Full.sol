// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "@gemunion/contracts/contracts/AccessList/BlackList.sol";

import "./ERC998UpgradeableRandom.sol";

contract ERC998Full is ERC998UpgradeableRandom, BlackList {
  constructor(
    string memory name,
    string memory symbol,
    uint96 royalty,
    string memory baseTokenURI
  ) ERC998UpgradeableRandom(name, symbol, royalty, baseTokenURI) {}

  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 amount
  ) internal override {
    require(!this.isBlacklisted(from), "Blacklist: sender is blacklisted");
    require(!this.isBlacklisted(to), "Blacklist: receiver is blacklisted");
    super._beforeTokenTransfer(from, to, amount);
  }

  function supportsInterface(bytes4 interfaceId)
    public
    view
    virtual
    override(AccessControl, ERC998UpgradeableRandom)
    returns (bool)
  {
    return super.supportsInterface(interfaceId);
  }
}
