// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "../ERC721/interfaces/IERC721Random.sol";

contract ERC20ERC721Staking is AccessControl, Pausable {
  using Address for address;
  using Counters for Counters.Counter;
  using SafeERC20 for IERC20;

  uint256 private _period; // seconds
  uint256 private _amount; // wei

  IERC20 private _acceptedToken;
  IERC721Random private _rewardToken;

  Counters.Counter private _stakeIdCounter;

  bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

  struct StakingData {
    address _owner;
    uint256 _startTimestamp;
    uint256 _finishTimestamp;
    uint256 _amount;
    uint256 _period;
  }

  mapping(uint256 => StakingData) private _stakes;

  event StakingDeposit(
    uint256 stakingId,
    address owner,
    uint256 startTimestamp,
    uint256 finishTimestamp,
    uint256 amount,
    uint256 period
  );
  event StakingWithdraw(uint256 stakingId, address owner, uint256 withdrawTimestamp, uint256 tokenId);

  constructor(
    address acceptedToken,
    address rewardToken,
    uint256 period,
    uint256 amount
  ) {
    require(acceptedToken.isContract(), "Staking: The accepted token address must be a deployed contract");
    _acceptedToken = IERC20(acceptedToken);
    require(rewardToken.isContract(), "Staking: The reward token address must be a deployed contract");
    _rewardToken = IERC721Random(rewardToken);

    _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
    _setupRole(PAUSER_ROLE, _msgSender());

    setNewRules(period, amount);
  }

  function setNewRules(uint256 period, uint256 amount) public virtual onlyRole(DEFAULT_ADMIN_ROLE) {
    require(period != 0, "Staking: period length should greater than zero");
    require(amount != 0, "Staking: amount amount should greater than zero");

    _period = period;
    _amount = amount;
  }

  function deposit() public virtual whenNotPaused {
    _acceptedToken.safeTransferFrom(_msgSender(), address(this), _amount);

    uint256 stakeId = _stakeIdCounter.current();
    _stakeIdCounter.increment();

    _stakes[stakeId] = StakingData(_msgSender(), block.timestamp, block.timestamp + _period, _period, _amount);
    emit StakingDeposit(stakeId, _msgSender(), block.timestamp, block.timestamp + _period, _period, _amount);
  }

  function withdraw(uint256 stakingId) public virtual whenNotPaused {
    StakingData storage stake = _stakes[stakingId];
    require(stake._owner != address(0), "Staking: wrong staking id");
    require(stake._owner != _msgSender(), "Staking: not an owner");
    require(stake._amount != 0, "Staking: deposit withdrawn");

    _acceptedToken.safeTransferFrom(address(this), stake._owner, stake._amount);
    _rewardToken.mintRandom(_msgSender(), 1, 1);
  }

  function pause() public onlyRole(PAUSER_ROLE) {
    _pause();
  }

  function unpause() public onlyRole(PAUSER_ROLE) {
    _unpause();
  }

  receive() external payable {
    revert();
  }
}
