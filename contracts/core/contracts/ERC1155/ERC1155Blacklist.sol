// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "@gemunion/contracts-access-list/contracts/extension/BlackList.sol";

import "./ERC1155Simple.sol";

contract ERC1155Blacklist is ERC1155Simple, BlackList {
  constructor(uint96 royaltyNumerator, string memory baseTokenURI) ERC1155Simple(royaltyNumerator, baseTokenURI) {}

  function supportsInterface(
    bytes4 interfaceId
  ) public view virtual override(AccessControl, ERC1155ABSR) returns (bool) {
    return super.supportsInterface(interfaceId);
  }

  function _beforeTokenTransfer(
    address operator,
    address from,
    address to,
    uint256[] memory ids,
    uint256[] memory amounts,
    bytes memory data
  ) internal override {
    require(!this.isBlacklisted(from), "Blacklist: sender is blacklisted");
    require(!this.isBlacklisted(to), "Blacklist: receiver is blacklisted");
    super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
  }
}
