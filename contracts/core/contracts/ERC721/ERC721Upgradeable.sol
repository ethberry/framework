// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/utils/Counters.sol";

import "./ERC721Simple.sol";
import "./interfaces/IERC721Upgradeable.sol";

contract ERC721Upgradeable is IERC721Upgradeable, ERC721Simple {
  using Counters for Counters.Counter;

  event LevelUp(address from, uint256 tokenId, uint256 grade);

  bytes4 private constant IERC49064906_ID = 0x49064906;
  bytes4 private constant IERC721_UPGRADEABLE_ID = type(IERC721Upgradeable).interfaceId;

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

  function upgrade(uint256 tokenId) public virtual onlyRole(MINTER_ROLE) returns (bool) {
    _requireMinted(tokenId);
    uint256 grade = getRecordFieldValue(tokenId, GRADE);
    _upsertRecordField(tokenId, GRADE, grade + 1);
    emit LevelUp(_msgSender(), tokenId, grade + 1);
    emit MetadataUpdate(tokenId);
    return true;
  }

  function supportsInterface(bytes4 interfaceId) public view virtual override(IERC165, ERC721Simple) returns (bool) {
    return
      interfaceId == IERC49064906_ID || interfaceId == IERC721_UPGRADEABLE_ID || super.supportsInterface(interfaceId);
  }
}
