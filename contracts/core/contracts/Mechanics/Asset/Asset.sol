// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "./interfaces/IAsset.sol";

abstract contract AssetHelper {
  bytes internal constant ASSET_SIGNATURE = "Asset(uint256 tokenType,address token,uint256 tokenId,uint256 amount)";
  bytes32 internal constant ASSET_TYPEHASH = keccak256(abi.encodePacked(ASSET_SIGNATURE));

  function hashAssetStruct(Asset memory item) public pure returns (bytes32) {
    return keccak256(abi.encode(ASSET_TYPEHASH, item.tokenType, item.token, item.tokenId, item.amount));
  }

  function hashAssetStructArray(Asset[] memory items) public pure returns (bytes32) {
    uint256 length = items.length;
    bytes32[] memory padded = new bytes32[](length);
    for (uint256 i = 0; i < length; i++) {
      padded[i] = hashAssetStruct(items[i]);
    }
    return keccak256(
      abi.encodePacked(padded)
    );
  }
}
