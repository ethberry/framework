// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/Context.sol";

import "@gemunion/contracts-erc998td/contracts/extensions/ERC998ERC20Enumerable.sol";
import {ERC998Utils} from "@gemunion/contracts-erc998td/contracts/extensions/ERC998Utils.sol";

import "./ERC998SimpleEnum.sol";

contract ERC998ERC20Enum is ERC998SimpleEnum, ERC998ERC20Enumerable {
  constructor(
    string memory name,
    string memory symbol,
    uint96 royalty,
    string memory baseTokenURI
  ) ERC998SimpleEnum(name, symbol, royalty, baseTokenURI) {}

  /**
   * @dev See {IERC721-ownerOf}.
   */
  function ownerOf(uint256 tokenId) public view virtual override(ERC721, ERC998SimpleEnum) returns (address) {
    return super.ownerOf(tokenId);
  }

  /**
   * @dev See {IERC165-supportsInterface}.
   */
  function supportsInterface(
    bytes4 interfaceId
  ) public view virtual override(ERC998SimpleEnum, ERC998ERC20Enumerable) returns (bool) {
    return super.supportsInterface(interfaceId);
  }

  function _ownerOrApproved(address sender, uint256 tokenId) internal view override(ERC998ERC721, ERC998Utils) {
    super._ownerOrApproved(sender, tokenId);
  }

  /**
   * @dev See {IERC721-isApprovedForAll}.
   */
  function isApprovedForAll(
    address owner,
    address operator
  ) public view virtual override(ERC721, ERC998SimpleEnum) returns (bool) {
    return super.isApprovedForAll(owner, operator);
  }

  /**
   * @dev See {IERC721-getApproved}.
   */
  function getApproved(uint256 _tokenId) public view virtual override(ERC721, ERC998SimpleEnum) returns (address) {
    return super.getApproved(_tokenId);
  }

  /**
   * @dev See {IERC721-approve}.
   */
  function approve(address to, uint256 _tokenId) public virtual override(ERC721, ERC998SimpleEnum) {
    super.approve(to, _tokenId);
  }

  /**
   * @dev See {ERC721-_update}.
   */
  function _update(address to, uint256 tokenId, address auth) internal virtual override(ERC721, ERC998SimpleEnum) returns (address) {
    return super._update(to, tokenId, auth);
  }

  /**
   * @dev See {ERC721-_increaseBalance}.
   */
  function _increaseBalance(address account, uint128 amount) internal virtual override(ERC721, ERC998SimpleEnum) {
    super._increaseBalance(account, amount);
  }

  /**
   * @dev See {ERC721-_baseURI}.
   */
  function _baseURI() internal view virtual override(ERC721, ERC998SimpleEnum) returns (string memory) {
    return super._baseURI();
  }
}
