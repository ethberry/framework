// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";

import "@gemunion/contracts-misc/contracts/constants.sol";

import "../../Exchange/ExchangeUtils.sol";
import "../../utils/constants.sol";
import "./interfaces/IStaking.sol";
import "../Mysterybox/interfaces/IERC721Mysterybox.sol";
import "../../ERC721/interfaces/IERC721Random.sol";
import "../../ERC721/interfaces/IERC721Simple.sol";
import "../../ERC1155/interfaces/IERC1155Simple.sol";
import "../../ERC721/interfaces/IERC721Metadata.sol";

contract Staking is IStaking, ExchangeUtils, AccessControl, Pausable, ERC1155Holder, ERC721Holder {
  using Address for address;
  using Counters for Counters.Counter;
  using SafeERC20 for IERC20;

  Counters.Counter internal _ruleIdCounter;
  Counters.Counter internal _stakeIdCounter;

  mapping(uint256 => Rule) internal _rules;
  mapping(uint256 => Stake) internal _stakes;

  struct Metadata {
    bytes32 key;
    uint256 value;
  }

  Metadata[] _meta;

  uint256 private _maxStake = 0;
  mapping(address => uint256) internal _stakeCounter;

  event StakingStart(uint256 stakingId, uint256 ruleId, address owner, uint256 startTimestamp, uint256 tokenId);

  event StakingWithdraw(uint256 stakingId, address owner, uint256 withdrawTimestamp);
  event StakingFinish(uint256 stakingId, address owner, uint256 finishTimestamp, uint256 multiplier);

  constructor(uint256 maxStake) {
    _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
    _setupRole(PAUSER_ROLE, _msgSender());

    setMaxStake(maxStake);
  }

  function setRules(Rule[] memory rules) public onlyRole(DEFAULT_ADMIN_ROLE) {
    _setRules(rules);
  }

  function updateRule(uint256 ruleId, bool active) public onlyRole(DEFAULT_ADMIN_ROLE) {
    _updateRule(ruleId, active);
  }

  function fundEth() public payable whenNotPaused onlyRole(DEFAULT_ADMIN_ROLE) {}

  // todo add change event?
  function setMaxStake(uint256 maxStake) public onlyRole(DEFAULT_ADMIN_ROLE) {
    _maxStake = maxStake;
  }

  function deposit(uint256 ruleId, uint256 tokenId) public payable whenNotPaused {
    Rule memory rule = _rules[ruleId];
    require(rule.externalId != 0, "Staking: rule doesn't exist");
    require(rule.active, "Staking: rule doesn't active");

    if (_maxStake > 0) {
      require(_stakeCounter[_msgSender()] < _maxStake, "Staking: stake limit exceeded");
    }

    _stakeIdCounter.increment();
    uint256 stakeId = _stakeIdCounter.current();
    _stakeCounter[_msgSender()] = _stakeCounter[_msgSender()] + 1;

    Asset memory depositItem = Asset(rule.deposit.tokenType, rule.deposit.token, rule.deposit.tokenId, rule.deposit.amount);
    _stakes[stakeId] = Stake(_msgSender(), depositItem, ruleId, block.timestamp, 0, true);

    emit StakingStart(stakeId, ruleId, _msgSender(), block.timestamp, tokenId);

    // Check templateId if ERC721 or ERC998
    if (depositItem.tokenType == TokenType.ERC721 || depositItem.tokenType == TokenType.ERC998) {
      if (rule.deposit.tokenId != 0) {
        uint256 templateId = IERC721Metadata(depositItem.token).getRecordFieldValue(tokenId, TEMPLATE_ID);
        require(templateId == rule.deposit.tokenId, "Staking: wrong deposit token templateID");
      }
    }

    spendFrom(toArray(depositItem), _msgSender(), address(this));
  }

  function receiveReward(uint256 stakeId, bool withdrawDeposit, bool breakLastPeriod) public virtual whenNotPaused {
    Stake storage stake = _stakes[stakeId];
    Rule memory rule = _rules[stake.ruleId];
    Asset memory depositItem = _stakes[stakeId].deposit;

    require(stake.owner != address(0), "Staking: wrong staking id");
    require(stake.owner == _msgSender(), "Staking: not an owner");
    require(stake.activeDeposit, "Staking: deposit withdrawn already");

    uint256 startTimestamp = stake.startTimestamp;
    uint256 stakePeriod = rule.period;
    uint256 multiplier = _calculateRewardMultiplier(startTimestamp, block.timestamp, stakePeriod);

    uint256 stakeAmount = depositItem.amount;
    address payable receiver = payable(stake.owner);

    if (withdrawDeposit) {
      emit StakingWithdraw(stakeId, receiver, block.timestamp);
      stake.activeDeposit = false;

      depositItem.amount = multiplier == 0 ? (stakeAmount - (stakeAmount / 100) * (rule.penalty / 100)) : stakeAmount;

      spend(toArray(depositItem), receiver);
    } else {
      stake.startTimestamp = block.timestamp;
    }

    if (multiplier != 0) {
      emit StakingFinish(stakeId, receiver, block.timestamp, multiplier);

      Asset memory rewardItem = Asset(rule.reward.tokenType, rule.reward.token, rule.reward.tokenId, rule.reward.amount);
      rewardItem.amount = rewardItem.amount * multiplier;

      if (rewardItem.tokenType == TokenType.ERC20 || rewardItem.tokenType == TokenType.NATIVE) {
        // NATIVE, ERC20
        spend(toArray(rewardItem), receiver);
      } else if (rewardItem.tokenType == TokenType.ERC721 || rewardItem.tokenType == TokenType.ERC998) {
        // ERC721, ERC998
        for (uint256 i = 0; i < multiplier; i++) {
          if (IERC721Metadata(rewardItem.token).supportsInterface(IERC721_MYSTERY_ID)) {
            // If Support MysteryBox interface
            IERC721Mysterybox(rewardItem.token).mintBox(receiver, rewardItem.tokenId, rule.content);
          } else {
            acquire(toArray(rewardItem), receiver);
          }
        }
      } else {
        // ERC1155
        acquire(toArray(rewardItem), receiver);
      }
    }
    if (multiplier == 0 && !withdrawDeposit && !breakLastPeriod) revert("Staking: first period not yet finished");
  }

  function _calculateRewardMultiplier(
    uint256 startTimestamp,
    uint256 finishTimestamp,
    uint256 period
  ) internal pure virtual returns (uint256) {
    return (finishTimestamp - startTimestamp) / period;
  }

  function pause() public onlyRole(PAUSER_ROLE) {
    _pause();
  }

  function unpause() public onlyRole(PAUSER_ROLE) {
    _unpause();
  }

  function supportsInterface(
    bytes4 interfaceId
  ) public view virtual override(AccessControl, ERC1155Receiver) returns (bool) {
    return super.supportsInterface(interfaceId);
  }

  receive() external payable {
    revert();
  }

  function _setRules(Rule[] memory rules) internal {
    uint256 length = rules.length;
    for (uint256 i; i < length; i++) {
      _setRule(rules[i]);
    }
  }

  function _setRule(Rule memory rule) internal {
    _ruleIdCounter.increment();
    uint256 ruleId = _ruleIdCounter.current();

    // UnimplementedFeatureError: Copying of type struct Asset memory[] memory to storage not yet supported.
    // _rules[ruleId] = rule

    Rule storage p = _rules[ruleId];
    p.deposit = rule.deposit;
    p.reward = rule.reward;
    // p.content = rule.content;
    p.period = rule.period;
    p.penalty = rule.penalty;
    p.recurrent = rule.recurrent;
    p.active = rule.active;
    p.externalId = rule.externalId;

    uint256 length = rule.content.length;
    for (uint256 i = 0; i < length; i++) {
      p.content.push(rule.content[i]);
    }

    emit RuleCreated(ruleId, rule, rule.externalId);
  }

  function _updateRule(uint256 ruleId, bool active) internal {
    Rule memory rule = _rules[ruleId];
    require(rule.period != 0, "Staking: rule does not exist");
    _rules[ruleId].active = active;
    emit RuleUpdated(ruleId, active);
  }
}
