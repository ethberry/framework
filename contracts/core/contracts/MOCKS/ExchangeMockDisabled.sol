// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";

import "@gemunion/contracts-erc1363/contracts/extensions/ERC1363Receiver.sol";

import "../Exchange/ExchangeUtils.sol";

contract ExchangeMockDisabled is ExchangeUtils, AccessControl, ERC721Holder, ERC1155Holder, ERC1363Receiver {
  // disable everything
  DisabledTokenTypes _disabledAll = DisabledTokenTypes(true, true, true, true, true);

  function topUp(Asset[] memory price) external payable virtual {
    spendFrom(price, _msgSender(), address(this), _disabledAll);
  }

  function testSpendFrom(Asset[] memory price, address spender, address receiver) external payable {
    // Transfer tokens to self or other address
    spendFrom(price, spender, receiver, _disabledAll);
  }

  function testSpend(Asset[] memory price, address receiver) external payable {
    // Spender is always Exchange contract
    spend(price, receiver, _disabledAll);
  }

  function testAcquire(Asset[] memory price, address receiver) external payable {
    // Mint new tokens for receiver
    acquire(price, receiver, _disabledAll);
  }

  function supportsInterface(
    bytes4 interfaceId
  ) public view virtual override(AccessControl, ERC1155Receiver) returns (bool) {
    return
      interfaceId == type(IERC1363Receiver).interfaceId ||
      interfaceId == type(IERC1363Spender).interfaceId ||
      interfaceId == type(IERC721Receiver).interfaceId ||
      interfaceId == type(IERC1155Receiver).interfaceId ||
      super.supportsInterface(interfaceId);
  }

  /**
   * @dev Restrict the contract to receive Ether (receive via topUp function only).
   */
  receive() external payable {
    revert();
  }
}
