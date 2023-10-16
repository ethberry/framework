// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

import "@gemunion/contracts-mocks/contracts/Wallet.sol";
import "@gemunion/contracts-utils/contracts/PaymentSplitter.sol";
import "@gemunion/contracts-utils/contracts/roles.sol";

import "./LinearReferralPonzi.sol";
import "./interfaces/IPonzi.sol";
import "../../utils/TopUp.sol";
import "../../utils/constants.sol";
import "../../utils/errors.sol";

contract Ponzi is
  IPonzi,
  AccessControl,
  Pausable,
  LinearReferralPonzi,
  TopUp,
  Wallet,
  PaymentSplitter,
  ReentrancyGuard
{
  using Address for address;
  using SafeERC20 for IERC20;

  uint256 internal _ruleIdCounter;
  uint256 internal _stakeIdCounter;

  mapping(uint256 => Rule) internal _rules;
  mapping(uint256 => Stake) internal _stakes;

  event StakingStart(uint256 stakingId, uint256 ruleId, address owner, uint256 startTimestamp, uint256 tokenId);
  event StakingWithdraw(uint256 stakingId, address owner, uint256 withdrawTimestamp);
  event StakingFinish(uint256 stakingId, address owner, uint256 finishTimestamp, uint256 multiplier);
  event WithdrawToken(address token, uint256 amount);
  event FinalizedToken(address token, uint256 amount);

  // ONLY NATIVE and ERC20 allowed
  DisabledTokenTypes _disabledTypes = DisabledTokenTypes(false, false, true, true, true);

  //  event PaymentEthReceived(address from, uint256 amount);
  event PaymentEthSent(address to, uint256 amount);

  constructor(address[] memory payees, uint256[] memory shares) PaymentSplitter(payees, shares) {
    _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
    _grantRole(PAUSER_ROLE, _msgSender());
  }

  function setRules(Rule[] memory rules) public onlyRole(DEFAULT_ADMIN_ROLE) {
    _setRules(rules);
  }

  function updateRule(uint256 ruleId, bool active) public onlyRole(DEFAULT_ADMIN_ROLE) {
    _updateRule(ruleId, active);
  }

  // TODO implement maxDeposit limit
  function deposit(address referrer, uint256 ruleId) public payable whenNotPaused {
    Rule storage rule = _rules[ruleId];

    // Ensure that the rule exists and is active
    if (rule.period == 0) {
      revert NotExist();
    }
    if (!rule.active) {
      revert NotActive();
    }

    uint256 stakeId = ++_stakeIdCounter;

    Asset memory depositItem = Asset(rule.deposit.tokenType, rule.deposit.token, 0, rule.deposit.amount);
    _stakes[stakeId] = Stake(_msgSender(), depositItem, ruleId, block.timestamp, 0, true);

    emit StakingStart(stakeId, ruleId, _msgSender(), block.timestamp, 0);

    // Transfer tokens from user to this contract.
    ExchangeUtils.spendFrom(ExchangeUtils._toArray(depositItem), _msgSender(), address(this), _disabledTypes);

    //    if (depositItem.tokenType == TokenType.NATIVE) {
    //      require(msg.value == depositItem.amount, "Ponzi: wrong amount");
    //      emit PaymentEthReceived(_msgSender(), msg.value);
    //    } else if (depositItem.tokenType == TokenType.ERC20) {
    //      IERC20(depositItem.token).safeTransferFrom(_msgSender(), address(this), depositItem.amount);
    //    } else {
    //      revert("Ponzi: unsupported token type");
    //    }
    //
    //    Asset[] memory depositItems = new Asset[](1);
    //    depositItems[0] = depositItem;

    _afterPurchase(referrer, ExchangeUtils._toArray(depositItem));
  }

  function _afterPurchase(address referrer, Asset[] memory price) internal override(LinearReferralPonzi) {
    return super._afterPurchase(referrer, price);
  }

  function receiveReward(
    uint256 stakeId,
    bool withdrawDeposit,
    bool breakLastPeriod
  ) public virtual nonReentrant whenNotPaused {
    Stake storage stake = _stakes[stakeId];
    Rule storage rule = _rules[stake.ruleId];
    Asset storage depositItem = _stakes[stakeId].deposit;

    // Verify that the stake exists and the caller is the owner of the stake.
    if (stake.owner == address(0)) {
      revert WrongStake();
    }
    if (stake.owner != _msgSender()) {
      revert NotAnOwner();
    }
    if (!stake.activeDeposit) {
      revert Expired();
    }

    uint256 startTimestamp = stake.startTimestamp;
    uint256 stakePeriod = rule.period;
    uint256 stakeAmount = depositItem.amount;

    address payable receiver = payable(stake.owner);

    if (withdrawDeposit) {
      emit StakingWithdraw(stakeId, receiver, block.timestamp);
      stake.activeDeposit = false;

      // PENALTY
      // TODO better penalty calculation
      uint256 withdrawAmount = stakeAmount - (stakeAmount / 100) * (rule.penalty / 100);
      if (withdrawAmount > 0) {
        Asset memory depositItemWithdraw = depositItem;
        // Empty current stake deposit storage
        depositItem.amount = 0;
        // Transfer the deposit Asset to the receiver.
        ExchangeUtils.spend(ExchangeUtils._toArray(depositItemWithdraw), receiver, _disabledTypes);
      }
      //      // Transfer the deposit Asset to the receiver.
      //      ExchangeUtils.spend(ExchangeUtils._toArray(depositItemWithdraw), receiver, _disabledTypes);

      //      if (depositItem.tokenType == TokenType.NATIVE) {
      //        Address.sendValue(payable(receiver), withdrawAmount);
      //        emit PaymentEthSent(receiver, withdrawAmount);
      //      } else if (depositItem.tokenType == TokenType.ERC20) {
      //        SafeERC20.safeTransfer(IERC20(depositItem.token), receiver, withdrawAmount);
      //      }
    } else {
      stake.startTimestamp = block.timestamp;
    }

    uint256 multiplier = _calculateRewardMultiplier(startTimestamp, block.timestamp, stakePeriod);

    // Check cycle count
    uint256 maxCycles = rule.maxCycles;
    // multiplier = (maxCycles > 0) ? (multiplier + cycleCount >= maxCycles) ? (maxCycles - cycleCount): multiplier : multiplier;
    if (maxCycles > 0) {
      uint256 cycleCount = stake.cycles;

      if (multiplier + cycleCount >= maxCycles) {
        multiplier = maxCycles - cycleCount;
      }
    }

    if (multiplier > 0) {
      emit StakingFinish(stakeId, receiver, block.timestamp, multiplier);
      stake.cycles += multiplier;

      Asset storage reward = rule.reward;
      // Create a new Asset object representing the reward.
      Asset memory rewardItem = Asset(
        reward.tokenType,
        reward.token,
        reward.tokenId,
        reward.amount * multiplier // Multiply the reward amount by the multiplier to calculate the total reward.
      );

      // Transfer the reward Asset to the receiver.
      ExchangeUtils.spend(ExchangeUtils._toArray(rewardItem), receiver, _disabledTypes);

      //      if (rewardItem.tokenType == TokenType.NATIVE) {
      //        rewardAmount = rewardItem.amount * multiplier;
      //        Address.sendValue(payable(receiver), rewardAmount);
      //      } else if (rewardItem.tokenType == TokenType.ERC20) {
      //        rewardAmount = rewardItem.amount * multiplier;
      //        SafeERC20.safeTransfer(IERC20(rewardItem.token), receiver, rewardAmount);
      //      }
    }

    if (multiplier == 0 && !withdrawDeposit && !breakLastPeriod) {
      revert NotComplete();
    }
  }

  function _calculateRewardMultiplier(
    uint256 startTimestamp,
    uint256 finishTimestamp,
    uint256 period
  ) internal pure virtual returns (uint256) {
    if (startTimestamp <= finishTimestamp) {
      return (finishTimestamp - startTimestamp) / period;
    } else return 0;

    //  return (finishTimestamp - startTimestamp) / period;
  }

  // RULES
  function _setRules(Rule[] memory rules) internal {
    uint256 length = rules.length;
    for (uint256 i; i < length; ) {
      _setRule(rules[i]);
      unchecked {
        i++;
      }
    }
  }

  function _setRule(Rule memory rule) internal {
    uint256 ruleId = ++_ruleIdCounter;
    _rules[ruleId] = rule;
    emit RuleCreated(ruleId, rule, rule.externalId);
  }

  function _updateRule(uint256 ruleId, bool active) internal {
    Rule storage rule = _rules[ruleId];
    if (rule.period == 0) {
      revert NotExist();
    }
    _rules[ruleId].active = active;
    emit RuleUpdated(ruleId, active);
  }

  // WITHDRAW
  // TODO unify withdraw
  function withdrawToken(address token, uint256 amount) public nonReentrant onlyRole(DEFAULT_ADMIN_ROLE) {
    uint256 totalBalance = address(this).balance;
    if (token == address(0)) {
      //      require included in sendValue()
      //      totalBalance = address(this).balance;
      //      require(totalBalance >= amount, "Ponzi: balance exceeded");
      //      Address.sendValue(payable(_msgSender()), amount);
      if (totalBalance < amount) {
        revert BalanceExceed();
      }

      ExchangeUtils.spend(
        ExchangeUtils._toArray(Asset(TokenType.NATIVE, token, 0, amount)),
        _msgSender(),
        _disabledTypes
      );
    } else {
      totalBalance = IERC20(token).balanceOf(address(this));
      if (totalBalance < amount) {
        revert BalanceExceed();
      }
      ExchangeUtils.spend(
        ExchangeUtils._toArray(Asset(TokenType.ERC20, token, 0, amount)),
        _msgSender(),
        _disabledTypes
      );
    }

    emit WithdrawToken(token, amount);
  }

  // FINALIZE
  function finalizeByToken(address token) public nonReentrant onlyRole(DEFAULT_ADMIN_ROLE) {
    uint256 finalBalance;
    if (token == address(0)) {
      finalBalance = address(this).balance;
      if (finalBalance == 0) {
        revert ZeroBalance();
      }
      Address.sendValue(payable(_msgSender()), finalBalance);
    } else {
      finalBalance = IERC20(token).balanceOf(address(this));
      if (finalBalance == 0) {
        revert ZeroBalance();
      }
      SafeERC20.safeTransfer(IERC20(token), _msgSender(), finalBalance);
    }
    emit FinalizedToken(token, finalBalance);
  }

  function finalizeByRuleId(uint256 ruleId) public nonReentrant onlyRole(DEFAULT_ADMIN_ROLE) {
    Rule memory rule = _rules[ruleId];

    // Ensure that the rule exists
    if (rule.period == 0) {
      revert NotExist();
    }

    address token = rule.deposit.token;
    uint256 finalBalance;

    if (token == address(0)) {
      finalBalance = address(this).balance;
      if (finalBalance == 0) {
        revert ZeroBalance();
      }
      ExchangeUtils.spend(
        ExchangeUtils._toArray(Asset(TokenType.NATIVE, token, 0, finalBalance)),
        _msgSender(),
        _disabledTypes
      );
    } else {
      finalBalance = IERC20(token).balanceOf(address(this));
      if (finalBalance == 0) {
        revert ZeroBalance();
      }
      ExchangeUtils.spend(
        ExchangeUtils._toArray(Asset(TokenType.ERC20, token, 0, finalBalance)),
        _msgSender(),
        _disabledTypes
      );
    }
    emit FinalizedToken(token, finalBalance);
  }

  // USE WITH CAUTION
  function finalize() public onlyRole(DEFAULT_ADMIN_ROLE) {
    Address.sendValue(payable(_msgSender()), address(this).balance);
  }

  /**
   * @notice No tipping!
   * @dev Rejects any incoming ETH transfers
   */
  receive() external payable override(Wallet, TopUp, PaymentSplitter) {
    revert();
  }

  // PAUSE
  /**
   * @dev Triggers stopped state.
   *
   * Requirements:
   *
   * - The contract must not be paused.
   */
  function pause() public onlyRole(PAUSER_ROLE) {
    _pause();
  }

  /**
   * @dev Returns to normal state.
   *
   * Requirements:
   *
   * - The contract must be paused.
   */
  function unpause() public onlyRole(PAUSER_ROLE) {
    _unpause();
  }

  /**
   * @dev See {IERC165-supportsInterface}.
   */
  function supportsInterface(
    bytes4 interfaceId
  ) public view virtual override(AccessControl, TopUp, Wallet) returns (bool) {
    return super.supportsInterface(interfaceId);
  }
}
