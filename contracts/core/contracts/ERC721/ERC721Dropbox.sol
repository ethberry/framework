// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "@gemunion/contracts/contracts/ERC721/preset/ERC721ACBER.sol";
import "@gemunion/contracts/contracts/ERC721/ERC721BaseUrl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "../ERC721/interfaces/IERC721Random.sol";
import "../ERC721/interfaces/IERC721Dropbox.sol";

contract ERC721Dropbox is IERC721Dropbox, ERC721ACBER, ERC721BaseUrl {
  using Address for address;
  using Counters for Counters.Counter;

  struct ItemData {
    uint256 templateId;
  }

  mapping(uint256 => ItemData) internal _itemData;

  event UnpackDropbox(address collection, uint256 tokenId, uint256 templateId);

  constructor(
    string memory name,
    string memory symbol,
    uint96 royalty,
    string memory baseTokenURI
  ) ERC721ACBER(name, symbol, royalty) ERC721BaseUrl(baseTokenURI) {
    _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
    _setupRole(MINTER_ROLE, _msgSender());

    _tokenIdTracker.increment();
  }

  function mintDropbox(address to, uint256 templateId) public onlyRole(MINTER_ROLE) returns (uint256 tokenId) {
    tokenId = _tokenIdTracker.current();
    _itemData[tokenId] = ItemData(templateId);
    _safeMint(to, tokenId);
    _tokenIdTracker.increment();
  }

  function unpack(
    address collection,
    uint256 tokenId,
    uint256 dropboxId
  ) public {
    require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721Dropbox: unpack caller is not owner nor approved");

    ItemData memory data = _itemData[tokenId];
    emit UnpackDropbox(collection, tokenId, data.templateId);

    _burn(tokenId);
    IERC721Random(collection).mintRandom(_msgSender(), data.templateId, dropboxId);
  }

  function setBaseURI(string memory baseTokenURI) external onlyRole(DEFAULT_ADMIN_ROLE) {
    _setBaseURI(baseTokenURI);
  }

  function _baseURI() internal view virtual override returns (string memory) {
    return _baseURI(_baseTokenURI);
  }

  receive() external payable {
    revert();
  }

  function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
    return interfaceId == type(IERC721Dropbox).interfaceId || super.supportsInterface(interfaceId);
  }
}
