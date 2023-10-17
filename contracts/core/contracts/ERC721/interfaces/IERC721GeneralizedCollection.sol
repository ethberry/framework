// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.20;

import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";

interface IERC721GeneralizedCollection is IERC721 {
  struct Metadata {
    bytes32 key;
    uint256 value;
  }

  function getTokenMetadata(uint256 tokenId) external returns (Metadata[] calldata);

  function getRecordFieldValue(uint256 pk, bytes32 fieldKey) external view returns (uint256);
}
