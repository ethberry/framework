// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "./VestingFactory.sol";
import "./ERC20Factory.sol";
import "./ERC721Factory.sol";
import "./ERC998Factory.sol";
import "./ERC1155Factory.sol";
import "./MysteryboxFactory.sol";
import "./CollectionFactory.sol";
import "./PyramidFactory.sol";
import "./StakingFactory.sol";

contract ContractManager is
  VestingFactory,
  ERC20Factory,
  ERC721Factory,
  ERC998Factory,
  ERC1155Factory,
  MysteryboxFactory,
  CollectionFactory,
  PyramidFactory,
  StakingFactory
{}
