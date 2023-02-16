// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "./IERC721Simple.sol";
import "../extensions/IERC4906.sol";

interface IERC721Upgradeable is IERC721Simple, IERC4906 {
  function upgrade(uint256 tokenId) external returns (bool);
}
