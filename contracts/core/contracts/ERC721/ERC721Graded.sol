// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity >=0.8.13;

import "@openzeppelin/contracts/utils/Counters.sol";

import "@gemunion/contracts/contracts/ERC721/preset/ERC721ACBER.sol";
import "@gemunion/contracts/contracts/ERC721/ERC721BaseUrl.sol";
import "@gemunion/contracts/contracts/utils/GeneralizedCollection.sol";

import "./interfaces/IERC721Simple.sol";

contract ERC721Graded is IERC721Simple, ERC721ACBER, ERC721BaseUrl, GeneralizedCollection {
  using Counters for Counters.Counter;

  uint256 private _maxTemplateId = 0;

  constructor(
    string memory name,
    string memory symbol,
    string memory baseTokenURI,
    uint96 royalty
  ) ERC721ACBER(name, symbol, baseTokenURI, royalty) {
    // should start from 1
    _tokenIdTracker.increment();
  }

  function mintCommon(address to, uint256 templateId) public override onlyRole(MINTER_ROLE) returns (uint256 tokenId) {
    require(templateId != 0, "ERC721Graded: wrong type");
    require(templateId <= _maxTemplateId, "ERC721Graded: wrong type");
    tokenId = _tokenIdTracker.current();
    upsertRecordField(tokenId, keccak256(bytes("templateId")), templateId);
    upsertRecordField(tokenId, keccak256(bytes("grade")), 1);
    safeMint(to);
  }

  function setMaxTemplateId(uint256 maxTemplateId) public onlyRole(DEFAULT_ADMIN_ROLE) {
    _maxTemplateId = maxTemplateId;
  }

  function _baseURI() internal view virtual override(ERC721ACBER) returns (string memory) {
    return _baseURI(_baseTokenURI);
  }

  receive() external payable {
    revert();
  }
}
