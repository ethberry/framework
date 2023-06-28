// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "./ERC20Factory.sol";
import "./ERC721Factory.sol";
import "./ERC998Factory.sol";
import "./ERC1155Factory.sol";
import "./MysteryBoxFactory.sol";
import "./CollectionFactory.sol";
import "./PyramidFactory.sol";
import "./LotteryFactory.sol";
import "./RaffleFactory.sol";
import "./StakingFactory.sol";
import "./VestingFactory.sol";
import "./WaitListFactory.sol";

contract ContractManager is
  VestingFactory,
  ERC20Factory,
  ERC721Factory,
  ERC998Factory,
  ERC1155Factory,
  MysteryBoxFactory,
  CollectionFactory,
  PyramidFactory,
  StakingFactory,
  LotteryFactory,
  RaffleFactory,
  WaitListFactory
{}
