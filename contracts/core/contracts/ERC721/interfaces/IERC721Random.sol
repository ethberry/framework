// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "./IERC721Upgradeable.sol";

interface IERC721Random is IERC721Upgradeable {
  function mintRandom(address to, uint256 templateId) external;
}
