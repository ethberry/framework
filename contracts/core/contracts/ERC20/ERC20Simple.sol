// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity >=0.8.13;

import "@gemunion/contracts/contracts/ERC20/preset/ERC20ACBCS.sol";
import "@gemunion/contracts/contracts/AccessList/BlackList.sol";

contract ERC20Simple is ERC20ACBCS {
  constructor(
    string memory name,
    string memory symbol,
    uint256 cap
  ) ERC20ACBCS(name, symbol, cap) {}

  receive() external payable {
    revert();
  }
}
