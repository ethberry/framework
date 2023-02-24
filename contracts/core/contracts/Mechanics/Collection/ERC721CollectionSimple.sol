// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/utils/Counters.sol";

import "@gemunion/contracts-erc721/contracts/preset/ERC721ABRK.sol";
import "@gemunion/contracts-erc721/contracts/extensions/ERC721ABaseUrl.sol";

error MethodNotSupported();

contract ERC721CollectionSimple is ERC721ABRK, ERC721ABaseUrl {
  constructor(
    string memory name,
    string memory symbol,
    uint96 royalty,
    string memory baseTokenURI,
    uint96 batchSize,
    address owner
  ) ERC721ABRK(name, symbol, royalty) ERC721ABaseUrl(baseTokenURI) {
    _mintConsecutive2(owner, batchSize);
  }

  function _mintConsecutive2(address owner, uint96 batchSize) internal override returns (uint96) {
    return super._mintConsecutive(owner, batchSize);
  }

  function mintCommon(address to, uint256 tokenId) external virtual onlyRole(MINTER_ROLE) {
    _safeMint(to, tokenId);
  }

  function mint(address, uint256) public pure override {
    revert MethodNotSupported();
  }

  function safeMint(address, uint256) public pure override {
    revert MethodNotSupported();
  }

  function supportsInterface(
    bytes4 interfaceId
  ) public view virtual override(AccessControl, ERC721ABRK) returns (bool) {
    return super.supportsInterface(interfaceId);
  }

  function _baseURI() internal view virtual override(ERC721, ERC721ABaseUrl) returns (string memory) {
    return _baseURI(_baseTokenURI);
  }

  receive() external payable {
    revert();
  }
}
