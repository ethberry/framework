// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "@gemunion/contracts/contracts/ContractManager/VestingFactory.sol";
import "@gemunion/contracts/contracts/ContractManager/ERC20Factory.sol";
import "@gemunion/contracts/contracts/ContractManager/ERC721Factory.sol";
import "@gemunion/contracts/contracts/ContractManager/ERC998Factory.sol";
import "@gemunion/contracts/contracts/ContractManager/ERC1155Factory.sol";

contract ContractManager is VestingFactory, ERC20Factory, ERC721Factory, ERC998Factory, ERC1155Factory {
}
