// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "./IERC721Graded.sol";
import "../../Mechanics/Asset/interfaces/IAsset.sol";

interface IERC721Random is IERC721Graded {
  function mintRandom(address to, Asset calldata item) external;
}
