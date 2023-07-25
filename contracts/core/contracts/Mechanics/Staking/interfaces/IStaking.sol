// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "../../../Exchange/DiamondExchange/lib/interfaces/IAsset.sol";

interface IStaking {
  struct Rule {
    Asset[] deposit;
    Asset[] reward;
    Asset[][] content;
    uint256 period;
    uint256 penalty;
    uint256 maxStake;
    bool recurrent;
    bool active;
  }

  struct Stake {
    address owner;
    Asset[] deposit;
    uint256 ruleId;
    uint256 startTimestamp;
    uint256 cycles;
    bool activeDeposit;
  }

  function deposit(Params memory params, uint256[] calldata tokenIds) external payable;

  function receiveReward(uint256 stakeId, bool withdrawDeposit, bool breakLastPeriod) external;

  function withdrawBalance(Asset memory item) external;
}
