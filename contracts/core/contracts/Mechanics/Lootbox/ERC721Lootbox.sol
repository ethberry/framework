// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Counters.sol";

import "./interfaces/IERC721Lootbox.sol";
import "../../ERC721/interfaces/IERC721Random.sol";
import "../../ERC721/ERC721Simple.sol";

contract ERC721Lootbox is IERC721Lootbox, ERC721Simple {
  using Counters for Counters.Counter;

  using Address for address;

  mapping(uint256 => Asset) internal _itemData;

  event UnpackLootbox(uint256 tokenId);

  constructor(
    string memory name,
    string memory symbol,
    uint96 royalty,
    string memory baseTokenURI
  ) ERC721Simple(name, symbol, royalty, baseTokenURI) { }

  function mintLootbox(address to, Asset calldata item) public onlyRole(MINTER_ROLE) {
    require(item.tokenId != 0, "Lootbox: wrong item");

    uint256 tokenId = _tokenIdTracker.current();
    _tokenIdTracker.increment();

    // TODO this is not a proper lootbox template id
    upsertRecordField(tokenId, TEMPLATE_ID, item.tokenId);

    _itemData[tokenId] = item;
    _safeMint(to, tokenId);
  }

  function unpack(uint256 tokenId) public {
    require(_isApprovedOrOwner(_msgSender(), tokenId), "Lootbox: unpack caller is not owner nor approved");

    Asset memory item = _itemData[tokenId];
    emit UnpackLootbox(tokenId);

    _burn(tokenId);
    IERC721Random(item.token).mintRandom(_msgSender(), item);
  }

  function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
    return interfaceId == type(IERC721Lootbox).interfaceId || super.supportsInterface(interfaceId);
  }
}
