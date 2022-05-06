// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+undeads@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.4;

import "@gemunion/contracts/contracts/ERC721/preset/ERC721ACBER.sol";
import "@gemunion/contracts/contracts/ERC721/ERC721BaseUrl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "../Marketplace/interfaces/IEIP712ERC721.sol";

contract DropboxERC721 is ERC721ACBER, ERC721BaseUrl {
  using Address for address;
  using Counters for Counters.Counter;

  struct ItemData {
    uint256 templateId;
  }

  IEIP712ERC721 _item;
  mapping(uint256 => ItemData) internal _itemData;

  event Unpack(address collection, uint256 tokenId, uint256 templateId);

  constructor(
    string memory name,
    string memory symbol,
    string memory baseTokenURI,
    uint96 royaltyNumerator
  ) ERC721ACBER(name, symbol, baseTokenURI, royaltyNumerator) {
    _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
    _setupRole(MINTER_ROLE, _msgSender());

    _tokenIdTracker.increment();
  }

  function mintDropbox(
    address to,
    uint256 templateId
  ) public onlyRole(MINTER_ROLE) returns (uint256 tokenId) {
    tokenId = _tokenIdTracker.current();
    _itemData[tokenId] = ItemData(templateId);
    _safeMint(to, tokenId);
    _tokenIdTracker.increment();
  }

  function unpack(address collection, uint256 tokenId, uint256 dropboxId) public {
    require(_isApprovedOrOwner(_msgSender(), tokenId), "DropboxERC721: unpack caller is not owner nor approved");

    ItemData memory data = _itemData[tokenId];
    emit Unpack(collection, tokenId, data.templateId);

    _burn(tokenId);
    IEIP712ERC721(collection).mintRandom(_msgSender(), data.templateId, dropboxId);
  }

  function _baseURI() internal view virtual override(ERC721ACBER) returns (string memory) {
    return _baseURI(_baseTokenURI);
  }

  receive() external payable {
    revert();
  }
}
