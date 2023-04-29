// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/access/AccessControl.sol";

import "@gemunion/contracts-mocks/contracts/Wallet.sol";

import "../Exchange/ExchangeUtils.sol";

contract ExchangeMock is ExchangeUtils, AccessControl, Wallet {
  function topUp(Asset[] memory price) external payable virtual {
    spendFrom(price, _msgSender(), address(this), _disabledTypes);
  }

  function testSpendFrom(Asset[] memory price, address spender, address receiver) external payable {
    // Transfer tokens to self or other address
    spendFrom(price, spender, receiver, _disabledTypes);
  }

  function testSpend(Asset[] memory price, address receiver) external payable {
    // Spender is always Exchange contract
    spend(price, receiver, _disabledTypes);
  }

  function testAcquire(Asset[] memory price, address receiver) external payable {
    // Mint new tokens for receiver
    acquire(price, receiver, _disabledTypes);
  }

  function supportsInterface(bytes4 interfaceId) public view virtual override(AccessControl, Wallet) returns (bool) {
    return super.supportsInterface(interfaceId);
  }
}
