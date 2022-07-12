// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "@gemunion/contracts/contracts/AccessList/interfaces/IBlackList.sol";
import "@gemunion/contracts/contracts/AccessList/interfaces/IWhiteList.sol";

interface IAccessList is IBlackList, IWhiteList {

}
