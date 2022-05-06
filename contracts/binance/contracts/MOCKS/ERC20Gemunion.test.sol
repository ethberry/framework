// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+undeads@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.4;

import "@gemunion/contracts/contracts/ERC20/preset/ERC20ACBCS.sol";

contract ERC20GemunionTest is ERC20ACBCS {
  constructor(string memory name, string memory symbol) ERC20ACBCS(name, symbol, 1e9 * 1e18) {}
}
