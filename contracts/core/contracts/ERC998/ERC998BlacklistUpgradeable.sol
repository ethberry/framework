// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/utils/Counters.sol";

import "../utils/constants.sol";
import "./ERC998Blacklist.sol";
import "../ERC721/interfaces/IERC721Upgradeable.sol";

contract ERC998BlacklistUpgradeable is IERC721Upgradeable, ERC998Blacklist {
  using Counters for Counters.Counter;

  event LevelUp(address from, uint256 tokenId, uint256 grade);

  constructor(
    string memory name,
    string memory symbol,
    uint96 royalty,
    string memory baseTokenURI
  ) ERC998Blacklist(name, symbol, royalty, baseTokenURI) {}

  function mintCommon(
    address to,
    uint256 templateId
  ) external virtual override(IERC721Simple, ERC721Simple) onlyRole(MINTER_ROLE) {
    require(templateId != 0, "ERC998: wrong type");

    uint256 tokenId = _tokenIdTracker.current();
    _tokenIdTracker.increment();

    _upsertRecordField(tokenId, TEMPLATE_ID, templateId);
    _upsertRecordField(tokenId, GRADE, 0);

    _safeMint(to, tokenId);
  }

  function upgrade(uint256 tokenId) external virtual onlyRole(METADATA_ROLE) returns (bool) {
    _requireMinted(tokenId);
    uint256 grade = getRecordFieldValue(tokenId, GRADE);
    _upsertRecordField(tokenId, GRADE, grade + 1);
    emit LevelUp(_msgSender(), tokenId, grade + 1);
    emit MetadataUpdate(tokenId);
    return true;
  }

  function supportsInterface(bytes4 interfaceId) public view virtual override(IERC165, ERC998Blacklist) returns (bool) {
    return interfaceId == IERC4906_ID || interfaceId == IERC721_GRADE_ID || super.supportsInterface(interfaceId);
  }
}
