// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "../../Mechanics/Asset/interfaces/IAsset.sol";

interface IERC721Simple {
  function mintCommon(address to, Asset calldata item) external;
}
