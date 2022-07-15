// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/
import "@gemunion/contracts/contracts/utils/GeneralizedCollection.sol";

pragma solidity ^0.8.9;

abstract contract MetaDataGetter is GeneralizedCollection {

  struct Metadata {
    bytes32 key;
    uint256 value;
  }

  function getTokenMetadata(uint256 tokenId) public virtual view returns (Metadata[] memory) {

    uint256 arrSize = recordStructs[tokenId].fieldKeyList.length;
    Metadata[] memory tokenMetadata = new Metadata[](arrSize);
    for (uint8 i=0; i < arrSize; i++) {
      bytes32 metaField = recordStructs[tokenId].fieldKeyList[i];
      tokenMetadata[i] = Metadata(metaField, recordStructs[tokenId].fieldStructs[metaField].value);
    }
    return tokenMetadata;
  }

    function setTokenMetadata(uint256 tokenId, Metadata[] memory metadata) public virtual {
      uint256 arrSize = metadata.length;
      for(uint8 i=0; i < arrSize; i++) {
        upsertRecordField(tokenId, metadata[i].key, metadata[i].value);
      }
    }
}

