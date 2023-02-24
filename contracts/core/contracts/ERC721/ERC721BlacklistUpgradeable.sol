// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/utils/Counters.sol";

import "../utils/constants.sol";
import "./ERC721Blacklist.sol";
import "./interfaces/IERC721Upgradeable.sol";

contract ERC721BlacklistUpgradeable is IERC721Upgradeable, ERC721Blacklist {
  using Counters for Counters.Counter;

  event LevelUp(address from, uint256 tokenId, uint256 grade);

  constructor(
    string memory name,
    string memory symbol,
    uint96 royalty,
    string memory baseTokenURI
  ) ERC721Blacklist(name, symbol, royalty, baseTokenURI) {}

  function mintCommon(
    address account,
    uint256 templateId
  ) public virtual override(IERC721Simple, ERC721Simple) onlyRole(MINTER_ROLE) {
    uint256 tokenId = _mintCommon(account, templateId);

    _upsertRecordField(tokenId, GRADE, 0);
  }

  function upgrade(uint256 tokenId) public virtual onlyRole(MINTER_ROLE) returns (bool) {
    _requireMinted(tokenId);
    uint256 grade = getRecordFieldValue(tokenId, GRADE);
    _upsertRecordField(tokenId, GRADE, grade + 1);
    emit LevelUp(_msgSender(), tokenId, grade + 1);
    emit MetadataUpdate(tokenId);
    return true;
  }

  function supportsInterface(bytes4 interfaceId) public view virtual override(IERC165, ERC721Blacklist) returns (bool) {
    return interfaceId == IERC4906_ID || interfaceId == IERC721_GRADE_ID || super.supportsInterface(interfaceId);
  }
}
