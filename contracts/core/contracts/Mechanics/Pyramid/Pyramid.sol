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

import "./interfaces/IPyramid.sol";
import "./LinearReferralPyramid.sol";

contract Pyramid is IPyramid, AccessControl, Pausable, LinearReferralPyramid {
  using Address for address;
  using Counters for Counters.Counter;
  using SafeERC20 for IERC20;

  Counters.Counter internal _ruleIdCounter;
  Counters.Counter internal _stakeIdCounter;

  mapping(uint256 => Rule) internal _rules;
  mapping(uint256 => Stake) internal _stakes;

  bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

  event StakingStart(uint256 stakingId, uint256 ruleId, address owner, uint256 startTimestamp, uint256 tokenId);
  event StakingWithdraw(uint256 stakingId, address owner, uint256 withdrawTimestamp);
  event StakingFinish(uint256 stakingId, address owner, uint256 finishTimestamp, uint256 multiplier);
  event WithdrawToken(address token, uint256 amount);
  event FinalizedToken(address token, uint256 amount);

  event PaymentEthReceived(address from, uint256 amount);
  event PaymentEthSent(address to, uint256 amount);

  constructor() {
    _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
    _setupRole(PAUSER_ROLE, _msgSender());
  }

  function setRules(Rule[] memory rules) public onlyRole(DEFAULT_ADMIN_ROLE) {
    _setRules(rules);
  }

  function updateRule(uint256 ruleId, bool active) public onlyRole(DEFAULT_ADMIN_ROLE) {
    _updateRule(ruleId, active);
  }

  function deposit(
    address referrer,
    uint256 ruleId,
    uint256 tokenId
  ) public payable whenNotPaused {
    Rule storage rule = _rules[ruleId];
    require(rule.externalId != 0, "Pyramid: rule doesn't exist");
    require(rule.active, "Pyramid: rule doesn't active");

    _stakeIdCounter.increment();
    uint256 stakeId = _stakeIdCounter.current();

    Asset memory depositItem = Asset(rule.deposit.tokenType, rule.deposit.token, 0, rule.deposit.amount);
    _stakes[stakeId] = Stake(_msgSender(), depositItem, ruleId, block.timestamp, 0, true);

    emit StakingStart(stakeId, ruleId, _msgSender(), block.timestamp, tokenId);

    if (depositItem.tokenType == TokenType.NATIVE) {
      require(msg.value == depositItem.amount, "Pyramid: wrong amount");
      emit PaymentEthReceived(_msgSender(), msg.value);
    } else if (depositItem.tokenType == TokenType.ERC20) {
      IERC20(depositItem.token).safeTransferFrom(_msgSender(), address(this), depositItem.amount);
    } else {
      revert("Pyramid: unsupported token type");
    }

    Asset[] memory depositItems = new Asset[](1);
    depositItems[0] = depositItem;

    _afterPurchase(referrer, depositItems);
  }

  function _afterPurchase(address referrer, Asset[] memory price) internal override(LinearReferralPyramid) {
    return super._afterPurchase(referrer, price);
  }

  function receiveReward(
    uint256 stakeId,
    bool withdrawDeposit,
    bool breakLastPeriod
  ) public virtual whenNotPaused {
    Stake storage stake = _stakes[stakeId];
    Rule storage rule = _rules[stake.ruleId];
    Asset storage depositItem = _stakes[stakeId].deposit;

    require(stake.owner != address(0), "Pyramid: wrong staking id");
    require(stake.owner == _msgSender(), "Pyramid: not an owner");
    require(stake.activeDeposit, "Pyramid: deposit withdrawn already");

    uint256 startTimestamp = stake.startTimestamp;
    uint256 stakePeriod = rule.period;
    uint256 multiplier = _calculateRewardMultiplier(startTimestamp, block.timestamp, stakePeriod);

    uint256 stakeAmount = depositItem.amount;

    address payable receiver = payable(stake.owner);

    if (withdrawDeposit) {
      emit StakingWithdraw(stakeId, receiver, block.timestamp);
      stake.activeDeposit = false;

      // PENALTY // TODO penalty types?
      // uint256 withdrawAmount = multiplier == 0 ? (stakeAmount - stakeAmount / 100 * (rule.penalty / 100)) : stakeAmount;
      uint256 withdrawAmount = stakeAmount - stakeAmount / 100 * (rule.penalty / 100);

      if (depositItem.tokenType == TokenType.NATIVE) {
        Address.sendValue(payable(receiver), withdrawAmount);
        emit PaymentEthSent(receiver, withdrawAmount);
      } else if (depositItem.tokenType == TokenType.ERC20) {
        SafeERC20.safeTransfer(IERC20(depositItem.token), receiver, withdrawAmount);
      }
    } else {
      stake.startTimestamp = block.timestamp;
    }

    if (multiplier != 0) {
      emit StakingFinish(stakeId, receiver, block.timestamp, multiplier);

      Asset storage rewardItem = rule.reward;
      uint256 rewardAmount;

      if (rewardItem.tokenType == TokenType.NATIVE) {
        rewardAmount = rewardItem.amount * multiplier;
        Address.sendValue(payable(receiver), rewardAmount);
      } else if (rewardItem.tokenType == TokenType.ERC20) {
        rewardAmount = rewardItem.amount * multiplier;
        SafeERC20.safeTransfer(IERC20(rewardItem.token), receiver, rewardAmount);
      }
    }
    if (multiplier == 0 && !withdrawDeposit && !breakLastPeriod) revert("Pyramid: first period not yet finished");
  }

  function _calculateRewardMultiplier(
    uint256 startTimestamp,
    uint256 finishTimestamp,
    uint256 period
  ) internal pure virtual returns (uint256) {
    return (finishTimestamp - startTimestamp) / period;
  }

  // RULES
  function _setRules(Rule[] memory rules) internal {
    uint256 length = rules.length;
    for (uint256 i; i < length; i++) {
      _setRule(rules[i]);
    }
  }

  function _setRule(Rule memory rule) internal {
    _ruleIdCounter.increment();
    uint256 ruleId = _ruleIdCounter.current();
    _rules[ruleId] = rule;
    emit RuleCreated(ruleId, rule, rule.externalId);
  }

  function _updateRule(uint256 ruleId, bool active) internal {
    Rule memory rule = _rules[ruleId];
    require(rule.period != 0, "Pyramid: rule does not exist");
    _rules[ruleId].active = active;
    emit RuleUpdated(ruleId, active);
  }

  // WITHDRAW
  function withdrawToken(address token, uint256 amount) public onlyRole(DEFAULT_ADMIN_ROLE) {
    address account = _msgSender();
    uint256 totalBalance;
    if (token == address(0)) {
      totalBalance = address(this).balance;
      require(totalBalance >= amount, "Pyramid: balance exceeded");
      Address.sendValue(payable(account), amount);
    } else {
      totalBalance = IERC20(token).balanceOf(address(this));
      require(totalBalance >= amount, "Pyramid: balance exceeded");
      SafeERC20.safeTransfer(IERC20(token), account, amount);
    }
    emit WithdrawToken(token, amount);
  }

  // FINALIZE
  function finalizeByToken(address token) public onlyRole(DEFAULT_ADMIN_ROLE) {
    address account = _msgSender();
    uint256 finalBalance;
    if (token == address(0)) {
      finalBalance = address(this).balance;
      require(finalBalance > 0, "Pyramid: 0 balance");
      Address.sendValue(payable(account), finalBalance);
    } else {
      finalBalance = IERC20(token).balanceOf(address(this));
      require(finalBalance > 0, "Pyramid: 0 balance");
      SafeERC20.safeTransfer(IERC20(token), account, finalBalance);
    }
    emit FinalizedToken(token, finalBalance);
  }

  function finalizeByRuleId(uint256 ruleId) public onlyRole(DEFAULT_ADMIN_ROLE) {
    Rule memory rule = _rules[ruleId];
    require(rule.externalId != 0, "Pyramid: rule doesn't exist");
    address account = _msgSender();
    address token = rule.deposit.token;
    uint256 finalBalance;

    if (token == address(0)) {
      finalBalance = address(this).balance;
      require(finalBalance > 0, "Pyramid: 0 balance");
      Address.sendValue(payable(account), finalBalance);
    } else {
      finalBalance = IERC20(token).balanceOf(address(this));
      require(finalBalance > 0, "Pyramid: 0 balance");
      SafeERC20.safeTransfer(IERC20(token), account, finalBalance);
    }
    emit FinalizedToken(token, finalBalance);
  }

  // USE WITH CAUTION
  function finalize() public onlyRole(DEFAULT_ADMIN_ROLE) {
    selfdestruct(payable(_msgSender()));
  }

  // ETH FUND
  function fundEth() public payable onlyRole(DEFAULT_ADMIN_ROLE) {}

  receive() external payable {
    revert();
  }

  // PAUSE
  function pause() public onlyRole(PAUSER_ROLE) {
    _pause();
  }

  function unpause() public onlyRole(PAUSER_ROLE) {
    _unpause();
  }

  // INTERFACE
  function supportsInterface(bytes4 interfaceId) public view virtual override(AccessControl) returns (bool) {
    return super.supportsInterface(interfaceId);
  }
}
