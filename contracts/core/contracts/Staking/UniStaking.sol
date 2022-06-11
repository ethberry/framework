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

import "../ERC721/interfaces/IERC721Random.sol";
import "../ERC721/interfaces/IERC721Simple.sol";
import "../ERC1155/interfaces/IERC1155Simple.sol";
import "./AbstractStaking.sol";

contract UniStaking is AbstractStaking, AccessControl, Pausable {
  using Address for address;
  using Counters for Counters.Counter;
  using SafeERC20 for IERC20;

  bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
  bytes4 private constant IERC721_RANDOM = 0x0301b0bf;

  event StakingStart(uint256 stakingId, uint256 ruleId, address owner, uint256 startTimestamp, TokenData tokenData);

  event StakingWithdraw(uint256 stakingId, address owner, uint256 withdrawTimestamp);
  event StakingFinish(uint256 stakingId, address owner, uint256 finishTimestamp);

  function setRules(Rule[] memory rules) public onlyRole(DEFAULT_ADMIN_ROLE) {
    _setRules(rules);
  }

  function deposit(uint256 ruleId, TokenData memory tokenData) public payable whenNotPaused {
    Rule storage rule = _rules[ruleId];
    require(rule.period != 0, "Staking: rule doesn't exist");
    require(rule.active, "Staking: rule doesn't active");

    uint256 stakeId = _stakeIdCounter.current();
    _stakeIdCounter.increment();

    Item memory depositItem = Item(rule.deposit.itemType, rule.deposit.token, tokenData, rule.deposit.amount);
    _stakes[stakeId] = Stake(_msgSender(), depositItem, ruleId, block.timestamp, 0);

    emit StakingStart(stakeId, ruleId, _msgSender(), block.timestamp, tokenData);

    if (depositItem.itemType == ItemType.NATIVE) {
      require(msg.value == depositItem.amount, "Staking: wrong amount");
    } else if (depositItem.itemType == ItemType.ERC20) {
      IERC20(depositItem.token).safeTransferFrom(_msgSender(), address(this), depositItem.amount);
    } else if (depositItem.itemType == ItemType.ERC721) {
      IERC721(depositItem.token).safeTransferFrom(_msgSender(), address(this), tokenData.tokenId);
    } else if (depositItem.itemType == ItemType.ERC1155) {
      IERC1155(depositItem.token).safeTransferFrom(
        _msgSender(),
        address(this),
        tokenData.tokenId,
        depositItem.amount,
        "0x"
      );
    }
  }

  function receiveReward(
    uint256 stakeId,
    bool withdrawDeposit,
    bool breakLastPeriod
  ) public virtual whenNotPaused {
    Stake storage stake = _stakes[stakeId];
    Rule storage rule = _rules[stake.ruleId];
    Item storage depositItem = _stakes[stakeId].deposit;
    TokenData memory depositTokenData = depositItem.tokenData;

    require(stake.owner != address(0), "Staking: wrong staking id");
    require(stake.owner == _msgSender(), "Staking: not an owner");
    require(depositItem.amount != 0, "Staking: deposit withdrawn already");

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

      stake.deposit.amount = 0;
      if (depositItem.itemType == ItemType.NATIVE) {
        receiver.transfer(stakeAmount);
      } else if (depositItem.itemType == ItemType.ERC20) {
        IERC20(depositItem.token).safeTransferFrom(address(this), _msgSender(), depositItem.amount);
      } else if (depositItem.itemType == ItemType.ERC721) {
        IERC721(depositItem.token).safeTransferFrom(address(this), _msgSender(), depositTokenData.tokenId);
      } else if (depositItem.itemType == ItemType.ERC1155) {
        IERC1155(depositItem.token).safeTransferFrom(
          address(this),
          _msgSender(),
          depositTokenData.tokenId,
          depositItem.amount,
          "0x"
        );
      }
    } else {
      stake.startTimestamp = block.timestamp;
    }

    if (multiplier != 0) {
      emit StakingFinish(stakeId, receiver, block.timestamp);

      Item storage rewardItem = rule.reward;
      TokenData memory rewardTokenData = rule.reward.tokenData;
      uint256 rewardAmount;

      if (rewardItem.itemType == ItemType.NATIVE) {
        rewardAmount = rewardItem.amount * multiplier;
        receiver.transfer(rewardAmount);
      } else if (rewardItem.itemType == ItemType.ERC20) {
        rewardAmount = rewardItem.amount * multiplier;
        IERC20(rewardItem.token).safeTransferFrom(address(this), _msgSender(), rewardAmount);
      } else if (rewardItem.itemType == ItemType.ERC721) {
        bool randomInterface = IERC721(rewardItem.token).supportsInterface(IERC721_RANDOM);

        if (randomInterface) {
          IERC721Random(rewardItem.token).mintRandom(_msgSender(), rewardTokenData.templateId, rewardTokenData.dropboxId);
        } else {
          IERC721Simple(rewardItem.token).mintCommon(_msgSender(), rewardTokenData.templateId);
        }
      } else if (rewardItem.itemType == ItemType.ERC1155) {
        rewardAmount = rewardItem.amount * multiplier;
        IERC1155Simple(rewardItem.token).mint(
          _msgSender(),
          rewardTokenData.tokenId,
          rewardItem.amount,
          "0x"
        );
      }
    }
  }

  function _calculateRewardMultiplier(
    uint256 startTimestamp,
    uint256 finishTimestamp,
    uint256 period
  ) internal pure virtual returns (uint256) {
    return (finishTimestamp - startTimestamp) % period;
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
