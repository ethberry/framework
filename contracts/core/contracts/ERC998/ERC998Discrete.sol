// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@gemunion/contracts-misc/contracts/interfaces.sol";

import "../utils/constants.sol";
import "../ERC721/interfaces/IERC721Discrete.sol";
import "./ERC998Simple.sol";

contract ERC998Discrete is IERC721Discrete, ERC998Simple {
  event LevelUp(address account, uint256 tokenId, bytes32 attribute, uint256 value);

  constructor(
    string memory name,
    string memory symbol,
    uint96 royalty,
    string memory baseTokenURI
  ) ERC998Simple(name, symbol, royalty, baseTokenURI) {}

  function upgrade(uint256 tokenId, bytes32 attribute) public virtual override onlyRole(METADATA_ROLE) returns (bool) {
    if (attribute == TEMPLATE_ID) {
      revert ProtectedAttribute(attribute);
    }

    return _upgrade(tokenId, attribute);
  }

  function _upgrade(uint256 tokenId, bytes32 attribute) public virtual returns (bool) {
    _requireMinted(tokenId);
    uint256 value = isRecordFieldKey(tokenId, attribute) ? getRecordFieldValue(tokenId, attribute) : 0;
    _upsertRecordField(tokenId, attribute, value + 1);
    emit LevelUp(_msgSender(), tokenId, attribute, value + 1);
    emit MetadataUpdate(tokenId);
    return true;
  }

  function supportsInterface(bytes4 interfaceId) public view virtual override(IERC165, ERC998Simple) returns (bool) {
    return interfaceId == IERC4906_ID || interfaceId == IERC721_GRADE_ID || super.supportsInterface(interfaceId);
  }
}
