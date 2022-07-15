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

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";

import "./interfaces/IStaking.sol";
import "../Asset/interfaces/IAsset.sol";
import "../Lootbox/interfaces/ILootbox.sol";
import "../../ERC721/interfaces/IERC721Random.sol";
import "../../ERC721/interfaces/IERC721Simple.sol";
import "../../ERC1155/interfaces/IERC1155Simple.sol";

contract Staking is IStaking, AccessControl, Pausable, ERC1155Holder, ERC721Holder {
  using Address for address;
  using Counters for Counters.Counter;
  using SafeERC20 for IERC20;

  Counters.Counter internal _ruleIdCounter;
  Counters.Counter internal _stakeIdCounter;

  mapping(uint256 => Rule) internal _rules;
  mapping(uint256 => Stake) internal _stakes;

  bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
  bytes4 private constant IERC721_RANDOM = 0x0301b0bf;
  bytes4 private constant IERC721_LOOTBOX = 0xe7728dc6;

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

  function setMaxStake(uint256 maxStake) public onlyRole(DEFAULT_ADMIN_ROLE) {
    _maxStake = maxStake;
  }

  function deposit(uint256 ruleId, uint256 tokenId) public payable whenNotPaused {
    Rule storage rule = _rules[ruleId];
    require(rule.externalId != 0, "Staking: rule doesn't exist");
    require(rule.active, "Staking: rule doesn't active");
    require(_stakeCounter[_msgSender()] < _maxStake, "Staking: stake limit exceeded");

    _stakeIdCounter.increment();
    uint256 stakeId = _stakeIdCounter.current();
    _stakeCounter[_msgSender()] = _stakeCounter[_msgSender()] + 1;

    Asset memory depositItem = Asset(rule.deposit.tokenType, rule.deposit.token, tokenId, rule.deposit.amount);
    _stakes[stakeId] = Stake(_msgSender(), depositItem, ruleId, block.timestamp, 0, true);

    emit StakingStart(stakeId, ruleId, _msgSender(), block.timestamp, tokenId);

    if (depositItem.tokenType == TokenType.NATIVE) {
      require(msg.value == depositItem.amount, "Staking: wrong amount");
    } else if (depositItem.tokenType == TokenType.ERC20) {
      IERC20(depositItem.token).safeTransferFrom(_msgSender(), address(this), depositItem.amount);
    } else if (depositItem.tokenType == TokenType.ERC721 || depositItem.tokenType == TokenType.ERC998) {
      IERC721(depositItem.token).safeTransferFrom(_msgSender(), address(this), tokenId);
    } else if (depositItem.tokenType == TokenType.ERC1155) {
      IERC1155(depositItem.token).safeTransferFrom(_msgSender(), address(this), tokenId, depositItem.amount, "0x");
    }
  }

  function receiveReward(
    uint256 stakeId,
    bool withdrawDeposit,
    bool breakLastPeriod
  ) public virtual whenNotPaused {
    Stake storage stake = _stakes[stakeId];
    Rule storage rule = _rules[stake.ruleId];
    Asset storage depositItem = _stakes[stakeId].deposit;
    uint256 depositTokenId = depositItem.tokenId;

    require(stake.owner != address(0), "Staking: wrong staking id");
    require(stake.owner == _msgSender(), "Staking: not an owner");
    require(stake.activeDeposit, "Staking: deposit withdrawn already");

    uint256 multiplier;
    uint256 startTimestamp = stake.startTimestamp;
    uint256 stakePeriod = rule.period;

    if (withdrawDeposit || breakLastPeriod) {
      multiplier = _calculateRewardMultiplier(startTimestamp, block.timestamp, stakePeriod);
    } else {
      multiplier = _calculateRewardMultiplier(
        startTimestamp,
        startTimestamp + (((block.timestamp - startTimestamp) % stakePeriod) * stakePeriod),
        stakePeriod
      );
    }

    uint256 stakeAmount = depositItem.amount;
    address payable receiver = payable(stake.owner);

    if (withdrawDeposit) {
      emit StakingWithdraw(stakeId, receiver, block.timestamp);
      stake.activeDeposit = false;

      if (depositItem.tokenType == TokenType.NATIVE) {
        Address.sendValue(payable(receiver), stakeAmount);
      } else if (depositItem.tokenType == TokenType.ERC20) {
        SafeERC20.safeTransfer(IERC20(depositItem.token), _msgSender(), stakeAmount);
      } else if (depositItem.tokenType == TokenType.ERC721 || depositItem.tokenType == TokenType.ERC998) {
        IERC721(depositItem.token).safeTransferFrom(address(this), _msgSender(), depositTokenId);
      } else if (depositItem.tokenType == TokenType.ERC1155) {
        IERC1155(depositItem.token).safeTransferFrom(address(this), _msgSender(), depositTokenId, stakeAmount, "0x");
      }
    } else {
      stake.startTimestamp = block.timestamp;
    }

    if (multiplier != 0) {
      emit StakingFinish(stakeId, receiver, block.timestamp, multiplier);

      Asset storage rewardItem = rule.reward;
      uint256 rewardTokenId = rule.reward.tokenId;
      uint256 rewardAmount;

      if (rewardItem.tokenType == TokenType.NATIVE) {
        rewardAmount = rewardItem.amount * multiplier;
        Address.sendValue(payable(receiver), rewardAmount);
      } else if (rewardItem.tokenType == TokenType.ERC20) {
        rewardAmount = rewardItem.amount * multiplier;
        SafeERC20.safeTransfer(IERC20(rewardItem.token), _msgSender(), rewardAmount);
      } else if (rewardItem.tokenType == TokenType.ERC721 || rewardItem.tokenType == TokenType.ERC998) {
        bool randomInterface = IERC721(rewardItem.token).supportsInterface(IERC721_RANDOM);
        bool lootboxInterface = IERC721(rewardItem.token).supportsInterface(IERC721_LOOTBOX);

        if (randomInterface) {
          for (uint256 i = 0; i < multiplier; i++) {
            IERC721Random(rewardItem.token).mintRandom(_msgSender(), rewardTokenId, 0);
          }
        } else if (lootboxInterface) {
          for (uint256 i = 0; i < multiplier; i++) {
            ILootbox(rewardItem.token).mintLootbox(_msgSender(), rewardTokenId);
          }
        } else {
          for (uint256 i = 0; i < multiplier; i++) {
            IERC721Simple(rewardItem.token).mintCommon(_msgSender(), rewardTokenId);
          }
        }
      } else if (rewardItem.tokenType == TokenType.ERC1155) {
        rewardAmount = rewardItem.amount * multiplier;
        IERC1155Simple(rewardItem.token).mint(_msgSender(), rewardTokenId, rewardAmount, "0x");
        // todo batch mint reward
      }
    }
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

  function supportsInterface(bytes4 interfaceId)
    public
    view
    virtual
    override(AccessControl, ERC1155Receiver)
    returns (bool)
  {
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
    _rules[ruleId] = rule;
    emit RuleCreated(ruleId, rule, rule.externalId);
  }

  function _updateRule(uint256 ruleId, bool active) internal {
    Rule memory rule = _rules[ruleId];
    require(rule.period != 0, "Staking: rule does not exist");
    _rules[ruleId].active = active;
    emit RuleUpdated(ruleId, active);
  }
}
