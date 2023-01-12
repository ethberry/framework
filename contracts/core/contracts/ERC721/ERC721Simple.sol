// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Counters.sol";

import "@gemunion/contracts-erc721/contracts/extensions/ERC721ABaseUrl.sol";
import "@gemunion/contracts-erc721/contracts/extensions/ERC721AMetaDataGetter.sol";
import "@gemunion/contracts-erc721-enumerable/contracts/preset/ERC721ABER.sol";

import "./interfaces/IERC721Simple.sol";

contract ERC721Simple is IERC721Simple, ERC721ABER, ERC721ABaseUrl, ERC721AMetaDataGetter {
  using Counters for Counters.Counter;

  bytes32 public constant GRADE = keccak256("GRADE");
  bytes32 public constant RARITY = keccak256("RARITY");
  bytes32 public constant GENES = keccak256("GENES");

  constructor(
    string memory name,
    string memory symbol,
    uint96 royalty,
    string memory baseTokenURI
  ) ERC721ABER(name, symbol, royalty) ERC721ABaseUrl(baseTokenURI) {
    // should start from 1
    _tokenIdTracker.increment();
  }

  function mintCommon(address account, uint256 templateId) external virtual override onlyRole(MINTER_ROLE) {
    _mintCommon(account, templateId);
  }

  function _mintCommon(address account, uint256 templateId) internal returns (uint256) {
    require(templateId != 0, "ERC721Simple: wrong type");

    uint256 tokenId = _tokenIdTracker.current();
    _tokenIdTracker.increment();

    _upsertRecordField(tokenId, TEMPLATE_ID, templateId);

    _safeMint(account, tokenId);

    return tokenId;
  }

  function mint(address) public pure override {
    revert MethodNotSupported();
  }

  function safeMint(address) public pure override {
    revert MethodNotSupported();
  }

  function supportsInterface(
    bytes4 interfaceId
  ) public view virtual override(AccessControl, ERC721ABER) returns (bool) {
    return super.supportsInterface(interfaceId);
  }

  function _baseURI() internal view virtual override(ERC721, ERC721ABaseUrl) returns (string memory) {
    return _baseURI(_baseTokenURI);
  }

  receive() external payable {
    revert();
  }
}
