// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "../override/SignatureValidator.sol";
import "../../Diamond/override/AccessControlInternal.sol";
import "../../Diamond/override/PausableInternal.sol";
import "../../Exchange/ExchangeUtils.sol";

contract ExchangeMockFacet is SignatureValidator, AccessControlInternal, PausableInternal {

  constructor() SignatureValidator() {}

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

  /**
 * @dev Allows to top-up the contract with tokens (NATIVE and ERC20 only).
   * @param price An array of Asset representing the tokens to be transferred.
   */
  function topUp(Asset[] memory price) external payable virtual {
    ExchangeUtils.spendFrom(price, _msgSender(), address(this), DisabledTokenTypes(false, false, true, true, true));
  }
}
