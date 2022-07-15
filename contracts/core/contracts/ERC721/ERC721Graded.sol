// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Counters.sol";

import "@gemunion/contracts/contracts/ERC721/preset/ERC721ACBER.sol";
import "@gemunion/contracts/contracts/ERC721/ERC721BaseUrl.sol";
import "@gemunion/contracts/contracts/utils/GeneralizedCollection.sol";

import "./interfaces/IERC721Graded.sol";
import "../Mechanics/MetaData/MetaDataGetter.sol";

contract ERC721Graded is IERC721Graded, ERC721ACBER, ERC721BaseUrl, GeneralizedCollection, MetaDataGetter {
  using Counters for Counters.Counter;

  event LevelUp(address from, uint256 tokenId, uint256 grade);

  bytes32 public constant TEMPLATE_ID = keccak256("templateId");
  bytes32 public constant GRADE = keccak256("grade");

  bytes32 public constant METADATA_ADMIN_ROLE = keccak256("METADATA_ADMIN_ROLE");

  constructor(
    string memory name,
    string memory symbol,
    uint96 royalty,
    string memory baseTokenURI
  ) ERC721ACBER(name, symbol, royalty) ERC721BaseUrl(baseTokenURI) {
    _setupRole(METADATA_ADMIN_ROLE, _msgSender());
    // should start from 1
    _tokenIdTracker.increment();
  }

  function mintCommon(address to, uint256 templateId) public override onlyRole(MINTER_ROLE) {
    require(templateId != 0, "ERC721Graded: wrong type");
    uint256 tokenId = _tokenIdTracker.current();
    upsertRecordField(tokenId, TEMPLATE_ID, templateId);
    upsertRecordField(tokenId, GRADE, 1);
    safeMint(to);
  }

  function levelUp(uint256 tokenId) public onlyRole(MINTER_ROLE) returns (bool) {
    uint256 grade = getRecordFieldValue(tokenId, GRADE);
    upsertRecordField(tokenId, GRADE, grade + 1);
    emit LevelUp(_msgSender(), tokenId, grade + 1);
    return true;
  }

  function setBaseURI(string memory baseTokenURI) external onlyRole(DEFAULT_ADMIN_ROLE) {
    _setBaseURI(baseTokenURI);
  }

  function _baseURI() internal view virtual override returns (string memory) {
    return _baseURI(_baseTokenURI);
  }

    function setTokenMetadata(uint256 tokenId, Metadata[] memory metadata) public override onlyRole(METADATA_ADMIN_ROLE){
      uint256 arrSize = metadata.length;
      for(uint8 i=0; i < arrSize; i++) {
        upsertRecordField(tokenId, metadata[i].key, metadata[i].value);
      }
    }

  receive() external payable {
    revert();
  }
}
