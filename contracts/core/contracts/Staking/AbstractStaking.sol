// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity >=0.8.13;

import "./interfaces/IStaking.sol";

abstract contract AbstractStaking is IStaking {
  function _setRules(Rule[] memory rules) internal {
    rules;
  }
}
