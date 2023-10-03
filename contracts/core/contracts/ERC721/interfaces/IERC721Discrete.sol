// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@gemunion/contracts-erc721/contracts/interfaces/IERC4906.sol";

import "./IERC721Simple.sol";

interface IERC721Discrete is IERC4906 {
  function upgrade(uint256 tokenId, bytes32 attribute) external returns (uint256);
}
