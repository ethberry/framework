// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Votes.sol";
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";

import "./ERC721Soulbound.sol";

contract ERC721SoulboundVotes is ERC721Soulbound, ERC721Votes {
  constructor(
    string memory name,
    string memory symbol,
    uint96 royalty,
    string memory baseTokenURI
  ) ERC721Soulbound(name, symbol, royalty, baseTokenURI) EIP712(name, "1") {}

  /**
   * @dev See {ERC721-_baseURI}.
   */
  function _baseURI() internal view virtual override(ERC721, ERC721Simple) returns (string memory) {
    return super._baseURI();
  }

  /**
   * @dev See {IERC165-supportsInterface}.
   */
  function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, ERC721Simple) returns (bool) {
    return super.supportsInterface(interfaceId);
  }

  /**
   * @dev See {ERC721-_update}.
   */
  function _update(address to, uint256 tokenId, address auth) internal virtual override(ERC721Soulbound, ERC721Votes) returns (address) {
    return super._update(to, tokenId, auth);
  }

  /**
   * @dev See {ERC721-_increaseBalance}.
   */
  function _increaseBalance(address account, uint128 amount) internal virtual override(ERC721ABER, ERC721Votes) {
    super._increaseBalance(account, amount);
  }
}
