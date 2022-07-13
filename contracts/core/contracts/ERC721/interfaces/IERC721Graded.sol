// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

interface IERC721Graded {
  function levelUp(uint256 tokenId) external returns (bool);
}
