// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";

import "../Exchange/ExchangeUtils.sol";

contract ExchangeMock is ExchangeUtils, AccessControl, ERC1155Holder, ERC721Holder {
  function testSpendFrom(Asset[] memory price) external payable {
    address account = _msgSender();
    spendFrom(price, account, address(this));
  }

  function testSpend(Asset[] memory price) external payable {
    address account = _msgSender();

    spend(price, address(this), account);
  }

  function supportsInterface(
    bytes4 interfaceId
  ) public view virtual override(AccessControl, ERC1155Receiver) returns (bool) {
    return super.supportsInterface(interfaceId);
  }

  receive() external payable {}
}
