// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/access/AccessControl.sol";

import "@gemunion/contracts-mocks/contracts/Wallet.sol";

import "../Exchange/ExchangeUtils.sol";

contract ExchangeMockDisabled is AccessControl, ERC721Holder, ERC1155Holder, ERC1363Receiver {
  // disable everything
  DisabledTokenTypes _disabledAll = DisabledTokenTypes(true, true, true, true, true);

  function topUp(Asset[] memory price) external payable virtual {
    ExchangeUtils.spendFrom(price, _msgSender(), address(this), _disabledAll);
  }

  function testSpendFrom(Asset[] memory price, address spender, address receiver) external payable {
    // Transfer tokens to self or other address
    ExchangeUtils.spendFrom(price, spender, receiver, _disabledAll);
  }

  function testSpend(Asset[] memory price, address receiver) external payable {
    // Spender is always Exchange contract
    ExchangeUtils.spend(price, receiver, _disabledAll);
  }

  function testAcquire(Asset[] memory price, address receiver) external payable {
    // Mint new tokens for receiver
    ExchangeUtils.acquire(price, receiver, _disabledAll);
  }

  function supportsInterface(bytes4 interfaceId) public view virtual override(AccessControl, Wallet) returns (bool) {
    return super.supportsInterface(interfaceId);
  }
}
