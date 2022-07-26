// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Counters.sol";

import "./interfaces/IERC721Lootbox.sol";
import "../Exchange/ExchangeUtils.sol";
import "../../ERC721/ERC721Simple.sol";

contract ERC721Lootbox is IERC721Lootbox, ERC721Simple, ExchangeUtils {
  using Counters for Counters.Counter;

  using Address for address;

  mapping(uint256 => Asset[]) internal _itemData;

  Asset[] internal _items;

  event UnpackLootbox(uint256 tokenId);

  constructor(
    string memory name,
    string memory symbol,
    uint96 royalty,
    string memory baseTokenURI
  ) ERC721Simple(name, symbol, royalty, baseTokenURI) {}

  function mintLootbox(
    address to,
    uint256 templateId,
    Asset[] memory items
  ) external onlyRole(MINTER_ROLE) {
    require(templateId != 0, "Lootbox: wrong item");
    require(items.length > 0, "Lootbox: no content");

    uint256 tokenId = _tokenIdTracker.current();
    _tokenIdTracker.increment();

    upsertRecordField(tokenId, TEMPLATE_ID, templateId);

    // remove lootbox itself
    // delete items[items.length - 1];

    // UnimplementedFeatureError: Copying of type struct Asset memory[] memory to storage not yet supported.
    uint256 length = items.length;

    for (uint256 i = 0; i < length; i++) {
      _itemData[tokenId].push(items[i]);
    }

    _safeMint(to, tokenId);
  }

  function unpack(uint256 tokenId) public {
    address account = _msgSender();

    require(_isApprovedOrOwner(account, tokenId), "Lootbox: unpack caller is not owner nor approved");

    emit UnpackLootbox(tokenId);

    _burn(tokenId);

    acquire(_itemData[tokenId], account);
  }

  function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
    return interfaceId == type(IERC721Lootbox).interfaceId || super.supportsInterface(interfaceId);
  }
}
