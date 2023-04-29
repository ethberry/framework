// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/access/AccessControl.sol";

import "@gemunion/contracts-mocks/contracts/Wallet.sol";

import "../Exchange/ExchangeUtils.sol";

contract ExchangeMock is AccessControl, ERC721Holder, ERC1155Holder, ERC1363Receiver {
  function topUp(Asset[] memory price) external payable virtual {
    ExchangeUtils.spendFrom(price, _msgSender(), address(this), DisabledTokenTypes(false, false, false, false, false));
  }

  function testSpendFrom(Asset[] memory price, address spender, address receiver) external payable {
    // Transfer tokens to self or other address
    ExchangeUtils.spendFrom(price, spender, receiver, DisabledTokenTypes(false, false, false, false, false));
  }

  function testSpend(Asset[] memory price, address receiver) external payable {
    // Spender is always Exchange contract
    ExchangeUtils.spend(price, receiver, DisabledTokenTypes(false, false, false, false, false));
  }

  function testAcquire(Asset[] memory price, address receiver) external payable {
    // Mint new tokens for receiver
    ExchangeUtils.acquire(price, receiver, DisabledTokenTypes(false, false, false, false, false));
  }

  function supportsInterface(bytes4 interfaceId) public view virtual override(AccessControl, Wallet) returns (bool) {
    return super.supportsInterface(interfaceId);
  }
}
