// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Counters.sol";

import "@gemunion/contracts/contracts/AccessList/BlackList.sol";

import "./ERC1155Simple.sol";

contract ERC1155Blacklist is ERC1155Simple, BlackList {
  using Counters for Counters.Counter;

  constructor(string memory baseTokenURI) ERC1155Simple(baseTokenURI) {}

  function supportsInterface(bytes4 interfaceId)
    public
    view
    virtual
    override(AccessControl, ERC1155ACBS)
    returns (bool)
  {
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
    require(!this.isBlacklisted(from), "ERC1155BlackList: sender is BlackListed");
    require(!this.isBlacklisted(to), "ERC1155BlackList: receiver is BlackListed");
    super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
  }
}
