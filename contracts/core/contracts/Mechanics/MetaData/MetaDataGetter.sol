// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/
import "@gemunion/contracts/contracts/utils/GeneralizedCollection.sol";

pragma solidity ^0.8.9;

abstract contract MetaDataGetter is GeneralizedCollection {

  // Returns token's metadata
  function getTokenMetadataArray(uint256 tokenId, bytes32[] calldata fields) public view returns (uint256[] memory) {

    uint256 arrSize = fields.length;
    uint256[] memory TokenMetadata = new uint256[](arrSize);
    for (uint8 i=0; i < arrSize; i++) {
      require (isRecordFieldKey(tokenId, fields[i]), "TokenMetadata: wrong field");
      TokenMetadata[i] = recordStructs[tokenId].fieldStructs[fields[i]].value;
    }
    return TokenMetadata;
  }

  struct Metadata {
    bytes32 key;
    uint256 value;
  }

  // Returns token's metadata
  function getTokenMetadata(uint256 tokenId) public view returns (Metadata[] memory) {

    uint256 arrSize = recordStructs[tokenId].fieldKeyList.length;
    Metadata[] memory tokenMetadata = new Metadata[](arrSize);
    for (uint8 i=0; i < arrSize; i++) {
      bytes32 metaField = recordStructs[tokenId].fieldKeyList[i];
      tokenMetadata[i] = Metadata(metaField, recordStructs[tokenId].fieldStructs[metaField].value);
    }
    return tokenMetadata;
  }

    function setTokenMetadata(uint256 tokenId, Metadata[] memory metadata) public {
      uint256 arrSize = metadata.length;
      for(uint8 i=0; i < arrSize; i++) {
        upsertRecordField(tokenId, metadata[i].key, metadata[i].value);
      }
    }
}

