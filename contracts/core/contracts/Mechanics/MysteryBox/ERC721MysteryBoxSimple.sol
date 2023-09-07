// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/utils/Counters.sol";

import "./interfaces/IERC721MysteryBox.sol";
import "../../Exchange/lib/ExchangeUtils.sol";
import "../../ERC721/ERC721Simple.sol";
import "../../utils/errors.sol";
import "../../utils/TopUp.sol";

contract ERC721MysteryBoxSimple is IERC721MysteryBox, ERC721Simple, TopUp {
  using Counters for Counters.Counter;

  using Address for address;

  mapping(uint256 => Asset[]) internal _itemData;

  event UnpackMysteryBox(address account, uint256 tokenId);

  constructor(
    string memory name,
    string memory symbol,
    uint96 royalty,
    string memory baseTokenURI
  ) ERC721Simple(name, symbol, royalty, baseTokenURI) {}

  function mintCommon(address, uint256) external virtual override onlyRole(MINTER_ROLE) {
    revert MethodNotSupported();
  }

  function mintBox(address account, uint256 templateId, Asset[] memory items) external onlyRole(MINTER_ROLE) {
    uint256 tokenId = _mintCommon(account, templateId);

    require(items.length > 0, "Mysterybox: no content");

    // UnimplementedFeatureError: Copying of type struct Asset memory[] memory to storage not yet supported.
    // _itemData[tokenId] = items;

    uint256 length = items.length;
    for (uint256 i = 0; i < length; ) {
      _itemData[tokenId].push(items[i]);
      unchecked {
        i++;
      }
    }
  }

  function unpack(uint256 tokenId) public {
    require(_isApprovedOrOwner(_msgSender(), tokenId), "Mysterybox: unpack caller is not owner nor approved");

    emit UnpackMysteryBox(_msgSender(), tokenId);

    _burn(tokenId);

    ExchangeUtils.acquire(_itemData[tokenId], _msgSender(), DisabledTokenTypes(false, false, false, false, false));
  }

  /**
   * @dev See {IERC165-supportsInterface}.
   */
  function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721Simple, TopUp) returns (bool) {
    return interfaceId == IERC721_MYSTERY_ID || super.supportsInterface(interfaceId);
  }

  /**
   * @dev Restrict the contract to receive Ether (receive via topUp function only).
   */
  receive() external payable override(ERC721Simple, TopUp) {
    revert();
  }
}
