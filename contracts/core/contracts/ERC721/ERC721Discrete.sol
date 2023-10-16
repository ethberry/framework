// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.20;

import "@gemunion/contracts-utils/contracts/interfaces.sol";

import "../utils/constants.sol";
import "./ERC721Simple.sol";
import "./interfaces/IERC721Discrete.sol";

contract ERC721Discrete is IERC721Discrete, ERC721Simple {
  event LevelUp(address account, uint256 tokenId, bytes32 attribute, uint256 value);

  constructor(
    string memory name,
    string memory symbol,
    uint96 royalty,
    string memory baseTokenURI
  ) ERC721Simple(name, symbol, royalty, baseTokenURI) {}

  /**
   * @dev Validates and upgrades attribute
   * @param tokenId The NFT to upgrade
   * @param attribute parameter name
   * @return uint256 The upgraded level
   */
  function upgrade(uint256 tokenId, bytes32 attribute) public virtual override onlyRole(METADATA_ROLE) returns (uint256) {
    // TEMPLATE_ID refers to database id
    if (attribute == TEMPLATE_ID) {
      revert ProtectedAttribute(attribute);
    }

    return _upgrade(tokenId, attribute);
  }

  /**
   * @dev Does actual upgrade
   * @param tokenId The NFT to upgrade
   * @param attribute parameter name
   * @return uint256 The upgraded level
   */
  function _upgrade(uint256 tokenId, bytes32 attribute) public virtual returns (uint256) {
    _requireOwned(tokenId);
    uint256 value = isRecordFieldKey(tokenId, attribute) ? getRecordFieldValue(tokenId, attribute) : 0;
    _upsertRecordField(tokenId, attribute, value + 1);
    emit LevelUp(_msgSender(), tokenId, attribute, value + 1);
    emit MetadataUpdate(tokenId);
    return value + 1;
  }

  /**
   * @dev See {IERC165-supportsInterface}.
   */
  function supportsInterface(bytes4 interfaceId) public view virtual override(IERC165, ERC721Simple) returns (bool) {
    return interfaceId == IERC4906_ID || interfaceId == IERC721_GRADE_ID || super.supportsInterface(interfaceId);
  }
}
