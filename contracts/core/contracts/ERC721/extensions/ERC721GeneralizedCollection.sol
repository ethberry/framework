// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

import "@openzeppelin/contracts/access/AccessControl.sol";

import "@gemunion/contracts-utils/contracts/GeneralizedCollection.sol";
import "@gemunion/contracts-utils/contracts/roles.sol";

pragma solidity ^0.8.20;

abstract contract ERC721GeneralizedCollection is AccessControl, GeneralizedCollection {
  constructor() {
    _grantRole(METADATA_ROLE, _msgSender());
  }

  struct Metadata {
    bytes32 key;
    uint256 value;
  }

  function getTokenMetadata(uint256 tokenId) public view returns (Metadata[] memory) {
    uint256 arrSize = recordStructs[tokenId].fieldKeyList.length;
    Metadata[] memory tokenMetadata = new Metadata[](arrSize);
    for (uint8 i = 0; i < arrSize; i++) {
      bytes32 metaField = recordStructs[tokenId].fieldKeyList[i];
      tokenMetadata[i] = Metadata(metaField, recordStructs[tokenId].fieldStructs[metaField].value);
    }
    return tokenMetadata;
  }
}
