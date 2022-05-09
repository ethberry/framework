// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.4;

interface IMetaData {
  struct MetaData {
    uint256 templateId;
    uint256 rarity;
    uint256 level;
  }

  function getDataByTokenId(uint256 tokenId) external view returns (MetaData memory);

  function setDataByTokenId(uint256 tokenId, MetaData memory data) external;
}
