// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/access/AccessControl.sol";

import "@gemunion/contracts-mocks/contracts/Wallet.sol";

import "../Exchange/DiamondExchange/lib/ExchangeUtils.sol";
import "../Exchange/DiamondExchange/lib/interfaces/IAsset.sol";
import "../utils/TopUp.sol";

contract ExchangeMock is AccessControl, Wallet, TopUp {
  function testSpendFrom(
    Asset[] memory price,
    address spender,
    address receiver,
    DisabledTokenTypes memory disabled
  ) external payable {
    // Transfer tokens to self or other address
    ExchangeUtils.spendFrom(price, spender, receiver, disabled);
  }

  function testSpend(Asset[] memory price, address receiver, DisabledTokenTypes memory disabled) external payable {
    // Spender is always Exchange contract
    ExchangeUtils.spend(price, receiver, disabled);
  }

  function testAcquire(Asset[] memory price, address receiver, DisabledTokenTypes memory disabled) external payable {
    // Mint new tokens for receiver
    ExchangeUtils.acquire(price, receiver, disabled);
  }

  function supportsInterface(
    bytes4 interfaceId
  ) public view virtual override(AccessControl, Wallet, TopUp) returns (bool) {
    return super.supportsInterface(interfaceId);
  }

  /**
   * @dev Rejects any incoming ETH transfers to this contract address
   */
  receive() external payable override(Wallet, TopUp) {
    revert();
  }
}
