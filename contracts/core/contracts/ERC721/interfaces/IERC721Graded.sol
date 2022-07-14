// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "./IERC721Simple.sol";

interface IERC721Graded is IERC721Simple {
  function levelUp(uint256 tokenId) external returns (bool);
}
