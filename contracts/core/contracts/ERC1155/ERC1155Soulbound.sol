// SPDX-License-Identifier: CC0-1.0

pragma solidity ^0.8.13;

import "./ERC1155Simple.sol";

contract ERC1155Soulbound is ERC1155Simple {
  constructor(uint96 royaltyNumerator, string memory baseTokenURI) ERC1155Simple(royaltyNumerator, baseTokenURI) {}

  /**
   * @dev See {ERC1155-_beforeTokenTransfer}.
   * Override that disables transfer
   */
  function _beforeTokenTransfer(
    address operator,
    address from,
    address to,
    uint256[] memory ids,
    uint256[] memory amounts,
    bytes memory data
  ) internal virtual override {
    require(from == address(0) || to == address(0), "ERC1155Soulbound: can't be transferred");
    super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
  }
}
