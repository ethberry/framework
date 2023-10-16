// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import {ERC1155Holder} from "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";

import "@gemunion/contracts-erc1363/contracts/extensions/ERC1363Receiver.sol";

import "./interfaces/IERC721Wrapper.sol";
import "../../ERC721/ERC721Simple.sol";
import "../../Exchange/lib/ExchangeUtils.sol";

contract ERC721Wrapper is IERC721Wrapper, ERC721Simple, ERC1155Holder, ERC721Holder, ERC1363Receiver {
  mapping(uint256 => Asset[]) internal _itemData;

  // event UnpackWrapper(uint256 tokenId);

  constructor(
    string memory name,
    string memory symbol,
    uint96 royalty,
    string memory baseTokenURI
  ) ERC721Simple(name, symbol, royalty, baseTokenURI) {}

  function mintCommon(address, uint256) external virtual override onlyRole(MINTER_ROLE) {
    revert MethodNotSupported();
  }

  function mintBox(address account, uint256 templateId, Asset[] memory items) external payable onlyRole(MINTER_ROLE) {
    require(items.length > 0, "Wrapper: no content");

    // UnimplementedFeatureError: Copying of type struct Asset memory[] memory to storage not yet supported.
    // _itemData[tokenId] = items;

    uint256 tokenId = _mintCommon(account, templateId);

    uint256 length = items.length;
    for (uint256 i = 0; i < length; ) {
      _itemData[tokenId].push(items[i]);
      unchecked {
        i++;
      }
    }

    ExchangeUtils.spendFrom(items, _msgSender(), address(this), DisabledTokenTypes(false, false, false, false, false));
  }

  function unpack(uint256 tokenId) public {
    _checkAuthorized(_ownerOf(tokenId), _msgSender(), tokenId);

    emit UnpackWrapper(tokenId);

    _burn(tokenId);

    ExchangeUtils.spend(_itemData[tokenId], _msgSender(), DisabledTokenTypes(false, false, false, false, false));
  }

  /**
   * @dev See {IERC165-supportsInterface}.
   */
  function supportsInterface(
    bytes4 interfaceId
  ) public view virtual override(ERC721Simple, ERC1155Holder) returns (bool) {
    return super.supportsInterface(interfaceId);
  }
}
