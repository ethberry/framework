// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";

import "../../ERC721/ERC721Simple.sol";
import "../../Exchange/ExchangeUtils.sol";

contract ERC721TokenWrapper is ERC721Simple, ExchangeUtils, ERC1155Holder, ERC721Holder {
  using Counters for Counters.Counter;

  mapping(uint256 => Asset[]) internal _itemData;

  event UnpackWrapper(uint256 tokenId);

  constructor(
    string memory name,
    string memory symbol,
    uint96 royalty,
    string memory baseTokenURI
  ) ERC721Simple(name, symbol, royalty, baseTokenURI) {}

  function mintCommon(address, uint256) external virtual override onlyRole(MINTER_ROLE) {
    revert MethodNotSupported();
  }

  function mintBox(address to, uint256 templateId, Asset[] memory items) external payable onlyRole(MINTER_ROLE) {
    require(templateId != 0, "Wrapper: wrong item");
    require(items.length > 0, "Wrapper: no content");

    uint256 tokenId = _tokenIdTracker.current();
    _tokenIdTracker.increment();

    _upsertRecordField(tokenId, TEMPLATE_ID, templateId);

    // UnimplementedFeatureError: Copying of type struct Asset memory[] memory to storage not yet supported.
    // _itemData[tokenId] = items;

    uint256 length = items.length;
    for (uint256 i = 0; i < length; i++) {
      _itemData[tokenId].push(items[i]);
    }

    address account = _msgSender();
    spendFrom(items, account, address(this));

    _safeMint(to, tokenId);
  }

  function unpack(uint256 tokenId) public {
    address account = _msgSender();

    require(_isApprovedOrOwner(account, tokenId), "Wrapper: unpack caller is not owner nor approved");

    spend(_itemData[tokenId], address(this), account);

    emit UnpackWrapper(tokenId);

    _burn(tokenId);
  }

  function supportsInterface(
    bytes4 interfaceId
  ) public view virtual override(ERC721Simple, ERC1155Receiver) returns (bool) {
    return super.supportsInterface(interfaceId);
  }
}
