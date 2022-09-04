// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Counters.sol";

import "./interfaces/IERC721Mysterybox.sol";
import "../Exchange/ExchangeUtils.sol";
import "../../ERC721/ERC721Simple.sol";

contract ERC721MysteryboxSimple is IERC721Mysterybox, ERC721Simple, ExchangeUtils {
  using Counters for Counters.Counter;

  using Address for address;

  mapping(uint256 => Asset[]) internal _itemData;

  Asset[] internal _items;

  event UnpackMysterybox(uint256 tokenId);

  constructor(
    string memory name,
    string memory symbol,
    uint96 royalty,
    string memory baseTokenURI
  ) ERC721Simple(name, symbol, royalty, baseTokenURI) {}

  function mintCommon(address, uint256) external virtual override onlyRole(MINTER_ROLE) {
    revert("Mysterybox: this method is not supported");
  }

  function mintBox(
    address to,
    uint256 templateId,
    Asset[] memory items
  ) external onlyRole(MINTER_ROLE) {
    require(templateId != 0, "Mysterybox: wrong item");
    require(items.length > 0, "Mysterybox: no content");

    uint256 tokenId = _tokenIdTracker.current();
    _tokenIdTracker.increment();

    upsertRecordField(tokenId, TEMPLATE_ID, templateId);

    // UnimplementedFeatureError: Copying of type struct Asset memory[] memory to storage not yet supported.
    // _itemData[tokenId] = items;

    uint256 length = items.length;
    for (uint256 i = 0; i < length; i++) {
      _itemData[tokenId].push(items[i]);
    }

    _safeMint(to, tokenId);
  }

  function unpack(uint256 tokenId) public {
    address account = _msgSender();

    require(_isApprovedOrOwner(account, tokenId), "Mysterybox: unpack caller is not owner nor approved");

    emit UnpackMysterybox(tokenId);

    _burn(tokenId);

    acquire(_itemData[tokenId], account);
  }

  function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
    return interfaceId == type(IERC721Mysterybox).interfaceId || super.supportsInterface(interfaceId);
  }
}
