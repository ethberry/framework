// SPDX-License-Identifier: MIT

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";

import "@gemunion/contracts-mocks/contracts/Wallet.sol";

import "../Exchange/ExchangeUtils.sol";

contract TopUp is Context, Wallet, ExchangeUtils {
  /**
   * @dev Allows to top-up the contract with tokens.
   * @param price An array of Asset representing the tokens to be transferred.
   */
  function topUp(Asset[] memory price) external payable virtual {
    spendFrom(price, _msgSender(), address(this), _disabledTypes);
  }

  receive() external payable virtual override {
    revert();
  }

  function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
    return
      interfaceId == type(IERC1363Receiver).interfaceId ||
      interfaceId == type(IERC1363Spender).interfaceId ||
      super.supportsInterface(interfaceId);
  }
}
