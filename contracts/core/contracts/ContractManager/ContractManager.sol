// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@gemunion/contracts/contracts/ContractManager/ERC20VestingFactory.sol";
import "@gemunion/contracts/contracts/ContractManager/ERC20TokenFactory.sol";
import "@gemunion/contracts/contracts/ContractManager/ERC721TokenFactory.sol";
import "@gemunion/contracts/contracts/ContractManager/ERC1155TokenFactory.sol";

contract ContractManager is ERC20VestingFactory, ERC20TokenFactory, ERC721TokenFactory, ERC1155TokenFactory {

}
