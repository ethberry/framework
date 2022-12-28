// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Counters.sol";

import "./ERC998Simple.sol";
import "../ERC721/interfaces/IERC721Upgradeable.sol";

contract ERC998Upgradeable is IERC721Upgradeable, ERC998Simple {
  using Counters for Counters.Counter;

  event LevelUp(address from, uint256 tokenId, uint256 grade);

  constructor(
    string memory name,
    string memory symbol,
    uint96 royalty,
    string memory baseTokenURI
  ) ERC998Simple(name, symbol, royalty, baseTokenURI) {}

  function mintCommon(
    address to,
    uint256 templateId
  ) external virtual override(IERC721Simple, ERC721Simple) onlyRole(MINTER_ROLE) {
    require(templateId != 0, "ERC998: wrong type");

    uint256 tokenId = _tokenIdTracker.current();
    _tokenIdTracker.increment();

    _upsertRecordField(tokenId, TEMPLATE_ID, templateId);
    _upsertRecordField(tokenId, GRADE, 1);

    _safeMint(to, tokenId);
  }

  function upgrade(uint256 tokenId) public onlyRole(MINTER_ROLE) returns (bool) {
    uint256 grade = getRecordFieldValue(tokenId, GRADE);
    _upsertRecordField(tokenId, GRADE, grade + 1);
    emit LevelUp(_msgSender(), tokenId, grade + 1);
    return true;
  }

  function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
    return interfaceId == type(IERC721Upgradeable).interfaceId || super.supportsInterface(interfaceId);
  }
}
