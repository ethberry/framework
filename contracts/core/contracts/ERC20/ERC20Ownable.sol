// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@gemunion/contracts-erc20/contracts/preset/ERC20OBCS.sol";

contract ERC20Ownable is ERC20OBCS {
  constructor(string memory name, string memory symbol, uint256 cap) ERC20OBCS(name, symbol, cap) {}

  receive() external payable {
    revert();
  }
}
