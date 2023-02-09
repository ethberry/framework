// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/access/AccessControl.sol";

import "../Exchange/ExchangeUtils.sol";

contract ExchangeMock is ExchangeUtils, AccessControl {
  function testSpendFrom(Asset[] memory price) external payable {
    address account = _msgSender();
    spendFrom(price, account, address(this));
  }

  function testSpend(Asset[] memory price) external payable {
    address account = _msgSender();

    spend(price, address(this), account);
  }

  receive() external payable {}
}
