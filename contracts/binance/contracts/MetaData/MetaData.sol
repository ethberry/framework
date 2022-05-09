// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "./interfaces/IMetaData.sol";

abstract contract MetaData is IMetaData {
  // tokenId => MetaData
  mapping(uint256 => MetaData) internal _metadata;

  event MetadataUpdated(uint256 tokenId, MetaData metadata);

  function getDataByTokenId(uint256 tokenId) external view virtual override returns (MetaData memory) {
    return _metadata[tokenId];
  }

  function setDataByTokenId(uint256 tokenId, MetaData memory data) external virtual override {
    _metadata[tokenId] = data;
    emit MetadataUpdated(tokenId, data);
  }
}
