// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Counters.sol";

import "@gemunion/contracts-erc721/contracts/preset/ERC721ABRK.sol";
import "@gemunion/contracts-erc721/contracts/extensions/ERC721ABaseUrl.sol";

error MethodNotSupported();

contract ERC721Collection is ERC721ABRK, ERC721ABaseUrl {
  constructor(
    string memory name,
    string memory symbol,
    uint96 royalty,
    string memory baseTokenURI,
    uint96 batchSize,
    address owner
  ) ERC721ABRK(name, symbol, royalty) ERC721ABaseUrl(baseTokenURI) {
    _mintConsecutive(owner, batchSize);
  }

  function mintCommon(address, uint256) public pure {
    revert MethodNotSupported();
  }

  function mint(address) public pure {
    revert MethodNotSupported();
  }

  function safeMint(address) public pure {
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
