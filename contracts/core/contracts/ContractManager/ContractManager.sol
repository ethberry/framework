// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "./VestingFactory.sol";
import "./ERC20Factory.sol";
import "./ERC721Factory.sol";
import "./ERC998Factory.sol";
import "./ERC1155Factory.sol";
import "./MysteryboxFactory.sol";
import "./PyramidFactory.sol";
import "./ERC721CollectionFactory.sol";
import "./StakingFactory.sol";

contract ContractManager is
  VestingFactory,
  ERC20Factory,
  ERC721Factory,
  ERC998Factory,
  ERC1155Factory,
  MysteryboxFactory,
  PyramidFactory,
  ERC721CollectionFactory,
  StakingFactory
{}
