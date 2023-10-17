// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.20;

import "@gemunion/contracts-utils/contracts/PaymentSplitter.sol";

contract SplitterWallet is PaymentSplitter {
  constructor(address[] memory payees, uint256[] memory shares) payable PaymentSplitter(payees, shares) {}
}
