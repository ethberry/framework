// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/utils/Counters.sol";

import "./interfaces/IERC721Mysterybox.sol";
import "../../Exchange/ExchangeUtils.sol";
import "../../ERC721/ERC721Simple.sol";
import "../../utils/errors.sol";

contract ERC721MysteryboxSimple is IERC721Mysterybox, ERC721Simple, ExchangeUtils {
  using Counters for Counters.Counter;

  using Address for address;

  mapping(uint256 => Asset[]) internal _itemData;

  event UnpackMysterybox(uint256 tokenId);

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
    for (uint256 i = 0; i < length; i++) {
      _itemData[tokenId].push(items[i]);
    }
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

  // ETH FUND
  function fundEth() public payable onlyRole(DEFAULT_ADMIN_ROLE) {}
}
