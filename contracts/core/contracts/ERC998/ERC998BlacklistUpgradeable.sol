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

  event LevelUp(address account, uint256 tokenId, bytes32 attribute, uint256 value);

  constructor(
    string memory name,
    string memory symbol,
    uint96 royalty,
    string memory baseTokenURI
  ) ERC998Blacklist(name, symbol, royalty, baseTokenURI) {}

  function mintCommon(address to, uint256 templateId) external virtual override onlyRole(MINTER_ROLE) {
    if (templateId == 0) {
      revert TemplateZero();
    }

    uint256 tokenId = _tokenIdTracker.current();
    _tokenIdTracker.increment();

    _upsertRecordField(tokenId, TEMPLATE_ID, templateId);

    _safeMint(to, tokenId);
  }

  function upgrade(uint256 tokenId, bytes32 attribute) public virtual override onlyRole(METADATA_ROLE) returns (bool) {
    if (attribute == TEMPLATE_ID) {
      revert ProtectedAttribute(attribute);
    }

    return _upgrade(tokenId, attribute);
  }

  function _upgrade(uint256 tokenId, bytes32 attribute) public virtual returns (bool) {
    _requireMinted(tokenId);
    uint256 value = isRecordFieldKey(tokenId, attribute) ? getRecordFieldValue(tokenId, attribute) : 0;
    _upsertRecordField(tokenId, attribute, value + 1);
    emit LevelUp(_msgSender(), tokenId, attribute, value + 1);
    emit MetadataUpdate(tokenId);
    return true;
  }

  function supportsInterface(bytes4 interfaceId) public view virtual override(IERC165, ERC998Blacklist) returns (bool) {
    return interfaceId == IERC4906_ID || interfaceId == IERC721_GRADE_ID || super.supportsInterface(interfaceId);
  }
}
