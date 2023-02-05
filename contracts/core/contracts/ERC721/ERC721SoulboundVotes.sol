// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

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

  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 firstTokenId,
    uint256 batchSize
  ) internal pure override(ERC721, ERC721Soulbound) {
    super._beforeTokenTransfer(from, to, firstTokenId, batchSize);
  }

  function _afterTokenTransfer(
    address from,
    address to,
    uint256 tokenId,
    uint256 batchSize
  ) internal override(ERC721, ERC721Votes) {
    super._afterTokenTransfer(from, to, tokenId, batchSize);
  }

  function _burn(uint256 tokenId) internal virtual override(ERC721, ERC721ABER) {
    super._burn(tokenId);
  }

  function _baseURI() internal view virtual override(ERC721, ERC721Simple) returns (string memory) {
    return super._baseURI();
  }

  function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, ERC721Simple) returns (bool) {
    return super.supportsInterface(interfaceId);
  }
}
