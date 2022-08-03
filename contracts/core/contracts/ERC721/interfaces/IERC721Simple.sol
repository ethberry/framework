// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "../../Mechanics/Exchange/interfaces/IAsset.sol";

interface IERC721Simple {
  function mintCommon(address to, uint256 templateId) external;
}
