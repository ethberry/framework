// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "@gemunion/contracts/contracts/ERC721/preset/ERC721ACBER.sol";
import "@gemunion/contracts/contracts/ERC721/ERC721BaseUrl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "./interfaces/ILootbox.sol";
import "../Asset/interfaces/IAsset.sol";
import "../../ERC721/interfaces/IERC721Random.sol";

contract Lootbox is ILootbox, ERC721ACBER, ERC721BaseUrl {
  using Address for address;
  using Counters for Counters.Counter;

  mapping(uint256 => Asset) internal _itemData;

  event UnpackLootbox(uint256 tokenId);

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

  function mintLootbox(address to, Asset calldata item) public onlyRole(MINTER_ROLE) {
    require(item.tokenId != 0, "ERC721Graded: wrong type");
    uint256 tokenId = _tokenIdTracker.current();
    _tokenIdTracker.increment();

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
    return interfaceId == type(ILootbox).interfaceId || super.supportsInterface(interfaceId);
  }
}
