// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.20;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {ERC721Burnable} from  "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";

import "@gemunion/contracts-erc721/contracts/extensions/ERC721ABaseUrl.sol";
import "@gemunion/contracts-erc721e/contracts/preset/ERC721ABER.sol";
import "@gemunion/contracts-utils/contracts/attributes.sol";

import "../utils/constants.sol";
import "../utils/errors.sol";
import "./interfaces/IERC721Simple.sol";
import "./extensions/ERC721GeneralizedCollection.sol";

contract ERC721Simple is IERC721Simple, ERC721ABER, ERC721ABaseUrl, ERC721GeneralizedCollection {
  constructor(
    string memory name,
    string memory symbol,
    uint96 royalty,
    string memory baseTokenURI
  ) ERC721ABER(name, symbol, royalty) ERC721ABaseUrl(baseTokenURI) {
    // should start from 1
    _nextTokenId++;
  }

  function mintCommon(address account, uint256 templateId) external virtual override onlyRole(MINTER_ROLE) {
    _mintCommon(account, templateId);
  }

  function _mintCommon(address account, uint256 templateId) internal returns (uint256) {
    if (templateId == 0) {
      revert TemplateZero();
    }

    _upsertRecordField(_nextTokenId, TEMPLATE_ID, templateId);

    _safeMint(account, _nextTokenId);

    return _nextTokenId++;
  }

  function mint(address) public pure override {
    revert MethodNotSupported();
  }

  function safeMint(address) public pure override {
    revert MethodNotSupported();
  }

  /**
   * @dev Burns `tokenId`. See {ERC721-_burn}.
   *
   * Requirements:
   *
   * - The caller must own `tokenId` or be an approved operator.
   */
  function burn(uint256 tokenId) public override(ERC721Burnable, IERC721Simple) {
    super.burn(tokenId);
  }


  /**
   * @dev See {IERC165-supportsInterface}.
   */
  function supportsInterface(
    bytes4 interfaceId
  ) public view virtual override(AccessControl, ERC721ABER) returns (bool) {
    return interfaceId == IERC721_SIMPLE_ID || super.supportsInterface(interfaceId);
  }

  function _baseURI() internal view virtual override(ERC721, ERC721ABaseUrl) returns (string memory) {
    return _baseURI(_baseTokenURI);
  }

  receive() external payable virtual {
    revert();
  }
}
