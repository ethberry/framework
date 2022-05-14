// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.4;

import "@gemunion/contracts/contracts/ERC20/preset/ERC20ACBCS.sol";
import "@gemunion/contracts/contracts/AccessList/BlackList.sol";

contract ERC20BlackList is ERC20ACBCS, BlackList {
  constructor(
    string memory name,
    string memory symbol,
    uint256 cap
  ) ERC20ACBCS(name, symbol, cap) {}

  receive() external payable {
    revert();
  }

  function supportsInterface(bytes4 interfaceId)
    public
    view
    virtual
    override(AccessControl, ERC20ACBCS)
    returns (bool)
  {
    return super.supportsInterface(interfaceId);
  }

  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 amount
  ) internal override {
    require(!isBlacklisted(from), "Coin: sender is BlackListed");
    require(!isBlacklisted(to), "Coin: receiver is BlackListed");
    super._beforeTokenTransfer(from, to, amount);
  }
}
