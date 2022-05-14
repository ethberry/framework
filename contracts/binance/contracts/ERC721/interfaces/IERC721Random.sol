// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+undeads@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.4;

import "./IERC721Simple.sol";

interface IERC721Random is IERC721Simple {
  function mintRandom(
    address to,
    uint256 templateId,
    uint256 dropboxId
  ) external;
}
