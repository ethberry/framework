// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/
import "@gemunion/contracts-mocks/contracts/Wallet.sol";
import "../Exchange/interfaces/IAsset.sol";
import "hardhat/console.sol";

pragma solidity ^0.8.13;

interface IStaking {
  function deposit(Params memory params, uint256[] calldata tokenIds) external payable;

  function receiveReward(uint256 stakeId, bool withdrawDeposit, bool breakLastPeriod) external;
}

contract ReentrancyStakingReward is Wallet {
  uint256 constant _maxReentrance = 1;
  uint256 _attacks;

  address Staking;
  uint256 _stakeId;
  bool _withdrawDeposit;
  bool _breakLastPeriod;

  event Reentered(bool success);

  constructor(address _staking) {
    Staking = _staking;
  }

  function deposit(Params memory param, uint256[] calldata tokenIds) public payable {
    (bool success, ) = Staking.call{ value: msg.value }(
      abi.encodeWithSelector(IStaking.deposit.selector, param, tokenIds)
    );
    if (!success) {
      revert("Attaker: Deposit fail");
    }
  }

  function receiveReward(uint256 stakeId, bool withdrawDeposit, bool breakLastPeriod) public {
    _attacks = 0;
    _stakeId = stakeId;
    _withdrawDeposit = withdrawDeposit;
    _breakLastPeriod = breakLastPeriod;
    IStaking(payable(Staking)).receiveReward(stakeId, withdrawDeposit, breakLastPeriod);
  }

  function onTransferReceived(
    address operator,
    address from,
    uint256 value,
    bytes memory data
  ) external override returns (bytes4) {
    _reenterReceiveReward();

    if (data.length == 1) {
      if (data[0] == 0x00) return bytes4(0);
      if (data[0] == 0x01) revert("onTransferReceived revert");
      if (data[0] == 0x02) revert();
      if (data[0] == 0x03) assert(false);
    }
    emit TransferReceived(operator, from, value, data);
    return this.onTransferReceived.selector;
  }

  function onERC721Received(
    address _a1,
    address _a2,
    uint256 _u1,
    bytes memory _b1
  ) public override returns (bytes4) {
    _reenterReceiveReward();

    return super.onERC721Received(_a1, _a2, _u1, _b1);
  }

  function onERC1155Received(
    address _a1,
    address _a2,
    uint256 _u1,
    uint256 _u2,
    bytes memory _b1
  ) public virtual override returns (bytes4) {
    _reenterReceiveReward();
    return super.onERC1155Received(_a1, _a2, _u1, _u2, _b1);
  }

  function onERC1155BatchReceived(
    address _a1,
    address _a2,
    uint256[] memory _u1,
    uint256[] memory _u2,
    bytes memory _b1
  ) public virtual override returns (bytes4) {
    _reenterReceiveReward();
    return super.onERC1155BatchReceived(_a1, _a2, _u1, _u2, _b1);
  }

  receive() external payable override {
    _reenterReceiveReward();
  }

  function _reenterReceiveReward() internal {
    if (_attacks < _maxReentrance) {
      _attacks += 1;
      (bool success, ) = Staking.call(
        abi.encodeWithSelector(IStaking.receiveReward.selector, _stakeId, _withdrawDeposit, _breakLastPeriod)
      );

      emit Reentered(success);
    }
  }
}
