// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@gemunion/contracts-erc721/contracts/extensions/ERC4907.sol";

import "./ERC721BlacklistUpgradeable.sol";

contract ERC721BlacklistUpgradeableRentable is ERC721BlacklistUpgradeable, ERC4907 {
  constructor(
    string memory name,
    string memory symbol,
    uint96 royalty,
    string memory baseTokenURI
  ) ERC721BlacklistUpgradeable(name, symbol, royalty, baseTokenURI) {}

  function _isApprovedOrOwner(address owner, uint256 tokenId) internal view override(ERC721, ERC4907) returns (bool) {
    return super._isApprovedOrOwner(owner, tokenId);
  }

  function setUser(uint256 tokenId, address user, uint64 expires) public override onlyRole(MINTER_ROLE) {
    super.setUser(tokenId, user, expires);
  }

  function supportsInterface(
    bytes4 interfaceId
  ) public view virtual override(ERC721BlacklistUpgradeable, ERC4907) returns (bool) {
    return super.supportsInterface(interfaceId);
  }
}
