// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+undeads@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";

import "@gemunion/contracts/contracts/ERC721/preset/ERC721ACBER.sol";
import "@gemunion/contracts/contracts/ERC721/ERC721BaseUrl.sol";

import "../Marketplace/interfaces/IEIP712ERC721.sol";

contract Skill is ERC721ACBER, ERC721BaseUrl, IEIP712ERC721 {
  using Counters for Counters.Counter;
  using Address for address;

  // tokenId => Item
  mapping(uint256 => Data) internal _skills;

  uint256 private _maxTemplateId = 0;

  constructor(
    string memory name,
    string memory symbol,
    string memory baseTokenURI,
    uint96 royaltyNumerator
  ) ERC721ACBER(name, symbol, baseTokenURI, royaltyNumerator) {
    _tokenIdTracker.increment();
    // should start from 1
  }

  function mintRandom(
    address to,
    uint256 templateId,
    uint256 dropboxId
  ) external override onlyRole(MINTER_ROLE) {
    revert("Disabled!");
  }

  function mintCommon(address to, uint256 templateId) public override returns (uint256 tokenId) {
    require(templateId != 0, "Item: wrong type");
    require(templateId <= _maxTemplateId, "Item: wrong type");
    tokenId = _tokenIdTracker.current();
    _skills[tokenId] = Data(templateId, 1);
    safeMint(to);
  }

  function getDataByTokenId(uint256 tokenId) public view override onlyRole(MINTER_ROLE) returns (Data memory) {
    require(_exists(tokenId), "Item: token does not exist");
    return _skills[tokenId];
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
