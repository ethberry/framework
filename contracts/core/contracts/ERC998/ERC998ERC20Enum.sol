// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/utils/Context.sol";

import "@gemunion/contracts-erc998td/contracts/extensions/ERC998ERC20Enumerable.sol";

import "./ERC998SimpleEnum.sol";

contract ERC998ERC20Enum is ERC998SimpleEnum, ERC998ERC20Enumerable {
  constructor(
    string memory name,
    string memory symbol,
    uint96 royalty,
    string memory baseTokenURI
  ) ERC998SimpleEnum(name, symbol, royalty, baseTokenURI) {}

  function ownerOf(uint256 tokenId) public view virtual override(ERC998SimpleEnum, ERC998ERC20) returns (address) {
    return super.ownerOf(tokenId);
  }

  function supportsInterface(
    bytes4 interfaceId
  ) public view virtual override(ERC998SimpleEnum, ERC998ERC20Enumerable) returns (bool) {
    return super.supportsInterface(interfaceId);
  }

  function _ownerOrApproved(address sender, uint256 tokenId) internal view override(ERC998ERC721, ERC998Utils) {
    super._ownerOrApproved(sender, tokenId);
  }
}
