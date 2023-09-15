// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@gemunion/contracts-access-list/contracts/extension/BlackList.sol";

import "./ERC1155Simple.sol";

contract ERC1155Blacklist is ERC1155Simple, BlackList {
  constructor(uint96 royaltyNumerator, string memory baseTokenURI) ERC1155Simple(royaltyNumerator, baseTokenURI) {}

  /**
   * @dev See {IERC165-supportsInterface}.
   */
  function supportsInterface(
    bytes4 interfaceId
  ) public view virtual override(AccessControl, ERC1155ABSR) returns (bool) {
    return super.supportsInterface(interfaceId);
  }

  /**
   * @dev See {ERC1155-_beforeTokenTransfer}.
   * Override that checks the access list
   */
  function _beforeTokenTransfer(
    address operator,
    address from,
    address to,
    uint256[] memory ids,
    uint256[] memory amounts,
    bytes memory data
  ) internal override {
    require(from == address(0) || !_isBlacklisted(from), "Blacklist: sender is blacklisted");
    require(to == address(0) || !_isBlacklisted(to), "Blacklist: receiver is blacklisted");
    super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
  }
}
