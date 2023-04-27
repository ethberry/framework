// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@gemunion/contracts-erc721/contracts/extensions/ERC4907.sol";

import "../utils/constants.sol";
import "./ERC721Simple.sol";
import "./interfaces/IERC721Upgradeable.sol";

contract ERC721UpgradeableRentable is IERC721Upgradeable, ERC721Simple, ERC4907 {
  using Counters for Counters.Counter;

  event LevelUp(address from, uint256 tokenId, uint256 grade);

  constructor(
    string memory name,
    string memory symbol,
    uint96 royalty,
    string memory baseTokenURI
  ) ERC721Simple(name, symbol, royalty, baseTokenURI) {}

  function mintCommon(
    address account,
    uint256 templateId
  ) public virtual override(IERC721Simple, ERC721Simple) onlyRole(MINTER_ROLE) {
    uint256 tokenId = _mintCommon(account, templateId);

    _upsertRecordField(tokenId, GRADE, 0);
  }

  function upgrade(uint256 tokenId) public virtual onlyRole(METADATA_ROLE) returns (bool) {
    _requireMinted(tokenId);
    uint256 grade = getRecordFieldValue(tokenId, GRADE);
    _upsertRecordField(tokenId, GRADE, grade + 1);
    emit LevelUp(_msgSender(), tokenId, grade + 1);
    emit MetadataUpdate(tokenId);
    return true;
  }

  function setUser(uint256 tokenId, address user, uint64 expires) public override onlyRole(MINTER_ROLE) {
    super.setUser(tokenId, user, expires);
  }

  function _isApprovedOrOwner(address owner, uint256 tokenId) internal view override(ERC721, ERC4907) returns (bool) {
    return super._isApprovedOrOwner(owner, tokenId);
  }

  function setUser(uint256 tokenId, address user, uint64 expires) public override onlyRole(METADATA_ROLE) {
    super.setUser(tokenId, user, expires);
  }

  function supportsInterface(
    bytes4 interfaceId
  ) public view virtual override(IERC165, ERC721Simple, ERC4907) returns (bool) {
    return interfaceId == IERC4906_ID || interfaceId == IERC721_GRADE_ID || super.supportsInterface(interfaceId);
  }
}
