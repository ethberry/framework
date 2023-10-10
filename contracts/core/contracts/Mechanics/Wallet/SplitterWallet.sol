// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/finance/PaymentSplitter.sol";

contract SplitterWallet is PaymentSplitter {
  constructor(address[] memory payees, uint256[] memory shares) payable PaymentSplitter(payees, shares) {}
}
