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


import "../ERC721/interfaces/IERC721Random.sol";
import "../ERC721/interfaces/IERC721Simple.sol";
import "../ERC721/interfaces/IERC721Dropbox.sol";
import "../ERC1155/interfaces/IERC1155Simple.sol";
import "./AbstractStaking.sol";

contract UniStaking is AbstractStaking, AccessControl, Pausable, ERC1155Holder, ERC721Holder {
  using Address for address;
  using Counters for Counters.Counter;
  using SafeERC20 for IERC20;

  bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
  bytes4 private constant IERC721_RANDOM = 0x0301b0bf;
  bytes4 private constant IERC721_DROPBOX = 0xe7728dc6;

  uint256 private _maxStake = 0;
  mapping(address => uint256) internal _stakeCounter;

  event StakingStart(uint256 stakingId, uint256 ruleId, address owner, uint256 startTimestamp, TokenData tokenData);

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

  function fundEth() public payable whenNotPaused onlyRole(DEFAULT_ADMIN_ROLE) {
  }

  function setMaxStake(uint256 maxStake) public onlyRole(DEFAULT_ADMIN_ROLE) {
    _maxStake = maxStake;
  }

  function deposit(uint256 ruleId, TokenData memory tokenData) public payable whenNotPaused {
    Rule storage rule = _rules[ruleId];
    require(rule.period != 0, "Staking: rule doesn't exist");
    require(rule.active, "Staking: rule doesn't active");
    require(_stakeCounter[_msgSender()] < _maxStake, "Staking: stake limit exceeded");

    uint256 stakeId = _stakeIdCounter.current();
    _stakeIdCounter.increment();
    _stakeCounter[_msgSender()] = _stakeCounter[_msgSender()] + 1;

    Item memory depositItem = Item(rule.deposit.itemType, rule.deposit.token, tokenData, rule.deposit.amount);
    _stakes[stakeId] = Stake(_msgSender(), depositItem, ruleId, block.timestamp, 0, true);

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

      if (depositItem.itemType == ItemType.NATIVE) {
        Address.sendValue(payable(receiver), stakeAmount);
      } else if (depositItem.itemType == ItemType.ERC20) {
        SafeERC20.safeTransfer(IERC20(depositItem.token), _msgSender(), stakeAmount);
      } else if (depositItem.itemType == ItemType.ERC721) {
        IERC721(depositItem.token).safeTransferFrom(address(this), _msgSender(), depositTokenData.tokenId);
      } else if (depositItem.itemType == ItemType.ERC1155) {
        IERC1155(depositItem.token).safeTransferFrom(
          address(this),
          _msgSender(),
          depositTokenData.tokenId,
          stakeAmount,
          "0x"
        );
      }
    } else {
      stake.startTimestamp = block.timestamp;
    }

    if (multiplier != 0) {
      emit StakingFinish(stakeId, receiver, block.timestamp, multiplier);

      Item storage rewardItem = rule.reward;
      TokenData memory rewardTokenData = rule.reward.tokenData;
      uint256 rewardAmount;

      if (rewardItem.itemType == ItemType.NATIVE) {
        rewardAmount = rewardItem.amount * multiplier;
        Address.sendValue(payable(receiver), rewardAmount);
      } else if (rewardItem.itemType == ItemType.ERC20) {
        rewardAmount = rewardItem.amount * multiplier;
        SafeERC20.safeTransfer(IERC20(rewardItem.token), _msgSender(), rewardAmount);
      } else if (rewardItem.itemType == ItemType.ERC721) {
        bool randomInterface = IERC721(rewardItem.token).supportsInterface(IERC721_RANDOM);
        bool dropboxInterface = IERC721(rewardItem.token).supportsInterface(IERC721_DROPBOX);

        // todo multiplier mint erc721
        if (randomInterface) {
          for (uint i=0; i<multiplier; i++) {
            IERC721Random(rewardItem.token).mintRandom(_msgSender(), rewardTokenData.templateId, 0);
          }
        } else if (dropboxInterface) {
          for (uint i=0; i<multiplier; i++) {
            IERC721Dropbox(rewardItem.token).mintDropbox(_msgSender(), rewardTokenData.templateId);
          }
        } else {
          for (uint i=0; i<multiplier; i++) {
            IERC721Simple(rewardItem.token).mintCommon(_msgSender(), rewardTokenData.templateId);
          }
        }
      } else if (rewardItem.itemType == ItemType.ERC1155) {
        rewardAmount = rewardItem.amount * multiplier;
        IERC1155Simple(rewardItem.token).mint(_msgSender(), rewardTokenData.tokenId, rewardAmount, "0x");
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

  function supportsInterface(bytes4 interfaceId) public view virtual
  override(AccessControl, ERC1155Receiver) returns (bool) {
    return
    interfaceId == type(IERC721Random).interfaceId ||
    super.supportsInterface(interfaceId);
  }

  receive() external payable {
    revert();
  }
}
