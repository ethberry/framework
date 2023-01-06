// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/finance/PaymentSplitter.sol";

import "../../Exchange/ExchangeUtils.sol";

contract Wallet is PaymentSplitter, ExchangeUtils {
  constructor(address[] memory payees, uint256[] memory shares) payable PaymentSplitter(payees, shares) {}

  function withdraw(Asset[] memory price) public {
    return spend(price, address(this), _msgSender());
  }
}
