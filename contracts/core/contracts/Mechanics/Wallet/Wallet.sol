// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/finance/PaymentSplitter.sol";

contract Wallet is PaymentSplitter {
  constructor(address[] memory payees, uint256[] memory shares) payable PaymentSplitter(payees, shares) {}
}
