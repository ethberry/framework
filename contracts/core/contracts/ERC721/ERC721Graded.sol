// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Counters.sol";

import "./ERC721Simple.sol";
import "./interfaces/IERC721Graded.sol";

contract ERC721Graded is IERC721Graded, ERC721Simple {
  using Counters for Counters.Counter;

  event LevelUp(address from, uint256 tokenId, uint256 grade);

  bytes32 public constant METADATA_ADMIN_ROLE = keccak256("METADATA_ADMIN_ROLE");

  constructor(
    string memory name,
    string memory symbol,
    uint96 royalty,
    string memory baseTokenURI
  ) ERC721Simple(name, symbol, royalty, baseTokenURI) {}

  function mintCommon(address to, uint256 templateId)
    public virtual
    override(IERC721Simple, ERC721Simple)
    onlyRole(MINTER_ROLE)
  {
    require(templateId != 0, "ERC721Graded: wrong type");

    uint256 tokenId = _tokenIdTracker.current();
    _tokenIdTracker.increment();

    upsertRecordField(tokenId, TEMPLATE_ID, templateId);
    upsertRecordField(tokenId, GRADE, 1);

    _safeMint(to, tokenId);
  }

  function upgrade(uint256 tokenId) public onlyRole(MINTER_ROLE) returns (bool) {
    uint256 grade = getRecordFieldValue(tokenId, GRADE);
    upsertRecordField(tokenId, GRADE, grade + 1);
    emit LevelUp(_msgSender(), tokenId, grade + 1);
    return true;
  }

  function setTokenMetadata(uint256 tokenId, Metadata[] memory metadata) public override onlyRole(METADATA_ADMIN_ROLE) {
    uint256 arrSize = metadata.length;
    for (uint8 i = 0; i < arrSize; i++) {
      upsertRecordField(tokenId, metadata[i].key, metadata[i].value);
    }
  }

  function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
    return interfaceId == type(IERC721Graded).interfaceId || super.supportsInterface(interfaceId);
  }
}
