// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/
// import "@gemunion/contracts-mocks/contracts/Wallet.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "./ERC1363ReceiverMock.sol";
import "../Exchange/interfaces/IAsset.sol";
import "hardhat/console.sol";

pragma solidity ^0.8.13;

interface IStaking {
  function deposit(Params memory params, uint256[] calldata tokenIds) external payable;

  function receiveReward(uint256 stakeId, bool withdrawDeposit, bool breakLastPeriod) external;

  function withdrawBalance(Asset memory item) external;
}

contract ReentrancyStakingReward is ERC165, ERC721Holder, ERC1155Holder, ERC1363ReceiverMock {
  bytes32 constant RECEIVE_REWARD = keccak256("RECEIVE_REWARD");
  bytes32 constant WITHDRAW = keccak256("WITHDRAW");

  address Staking;

  uint256 _maxReentrance = 1;
  uint256 _attacks;
  bytes32 lastMethod;

  // Arguments for receiveReward
  uint256 _stakeId;
  bool _withdrawDeposit;
  bool _breakLastPeriod;

  // Arguments for withdraw
  Asset _item;

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
    lastMethod = RECEIVE_REWARD;
    IStaking(Staking).receiveReward(stakeId, withdrawDeposit, breakLastPeriod);
  }

  function withdrawBalance(Asset memory item) public {
    lastMethod = WITHDRAW;
    _item = item;
    IStaking(Staking).withdrawBalance(item);
  }

  function onTransferReceived(
    address operator,
    address from,
    uint256 value,
    bytes memory data
  ) external override returns (bytes4) {
    _reenter();

    if (data.length == 1) {
      if (data[0] == 0x00) return bytes4(0);
      if (data[0] == 0x01) revert("onTransferReceived revert");
      if (data[0] == 0x02) revert();
      if (data[0] == 0x03) assert(false);
    }
    emit TransferReceived(operator, from, value, data);
    return this.onTransferReceived.selector;
  }

  function onERC721Received(address _a1, address _a2, uint256 _u1, bytes memory _b1) public override returns (bytes4) {
    _reenter();
    return super.onERC721Received(_a1, _a2, _u1, _b1);
  }

  function onERC1155Received(
    address _a1,
    address _a2,
    uint256 _u1,
    uint256 _u2,
    bytes memory _b1
  ) public virtual override returns (bytes4) {
    _reenter();
    return super.onERC1155Received(_a1, _a2, _u1, _u2, _b1);
  }

  function onERC1155BatchReceived(
    address _a1,
    address _a2,
    uint256[] memory _u1,
    uint256[] memory _u2,
    bytes memory _b1
  ) public virtual override returns (bytes4) {
    _reenter();
    return super.onERC1155BatchReceived(_a1, _a2, _u1, _u2, _b1);
  }

  receive() external payable {
    _reenter();
  }

  function _reenter() internal {
    if (_attacks < _maxReentrance) {
      bool success;
      _attacks += 1;
      if (lastMethod == RECEIVE_REWARD) {
        (success, ) = Staking.call(
          abi.encodeWithSelector(IStaking.receiveReward.selector, _stakeId, _withdrawDeposit, _breakLastPeriod)
        );
      } else {
        (success, ) = Staking.call(
          abi.encodeWithSelector(IStaking.withdrawBalance.selector, _item)
        );
      }

      emit Reentered(success);
    }
  }

  /**
   * @dev See {IERC165-supportsInterface}.
   */
  function supportsInterface(bytes4 interfaceId) public view virtual override(ERC165, ERC1155Receiver) returns (bool) {
    return
      interfaceId == type(IERC1363Receiver).interfaceId ||
      interfaceId == type(IERC1363Spender).interfaceId ||
      interfaceId == type(IERC721Receiver).interfaceId ||
      interfaceId == type(IERC1155Receiver).interfaceId ||
      super.supportsInterface(interfaceId);
  }
}
