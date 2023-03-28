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

import "@gemunion/contracts-misc/contracts/constants.sol";
import "@gemunion/contracts-mocks/contracts/Wallet.sol";

import "../../Exchange/ExchangeUtils.sol";
import "../../utils/constants.sol";
import "./interfaces/IStaking.sol";
import "../Mysterybox/interfaces/IERC721Mysterybox.sol";
import "../../ERC721/interfaces/IERC721Random.sol";
import "../../ERC721/interfaces/IERC721Simple.sol";
import "../../ERC1155/interfaces/IERC1155Simple.sol";
import "../../ERC721/interfaces/IERC721Metadata.sol";
import "../../Exchange/referral/LinearReferral.sol";

/**
 * @dev This contract implements a staking system where users can stake their tokens for a specific period of time
 * and receive rewards based on a set of predefined rules. Users can stake multiple times, and each stake creates a
 * new deposit with a unique stake ID. The rewards can be paid out in NATIVE, ERC20, ERC721, ERC998, or ERC1155 tokens.
 * The contract owner can set and update the rules for the staking system, as well as deposit and withdraw funds.
 * The staking contract is pausable in case of emergency situations or for maintenance purposes.
 */
contract StakingReferral is IStaking, ExchangeUtils, AccessControl, Pausable, LinearReferral, Wallet {
  using Address for address;
  using Counters for Counters.Counter;

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

  /**
   * @dev Sets the staking rules.
   */
  function setRules(Rule[] memory rules) public onlyRole(DEFAULT_ADMIN_ROLE) {
    _setRules(rules);
  }

  /**
   * @dev Updates the active state of a staking rule
   */
  function updateRule(uint256 ruleId, bool active) public onlyRole(DEFAULT_ADMIN_ROLE) {
    _updateRule(ruleId, active);
  }

  /**
   * @dev Allows the contract to receive Ether
   */
  function fundEth() public payable whenNotPaused onlyRole(DEFAULT_ADMIN_ROLE) {}

  /**
   * @dev Sets maxStake
   * TODO add change event?
   */
  function setMaxStake(uint256 maxStake) public onlyRole(DEFAULT_ADMIN_ROLE) {
    _maxStake = maxStake;
  }

  /**
   * @dev Deposit function allows a user to stake a specified token with a given rule.
   * @param ruleId - id of rule defined in _rules mapping.
   * @param tokenId - id of the token to be deposited.
   */
  function deposit(address referrer, uint256 ruleId, uint256 tokenId) public payable whenNotPaused {
    // Retrieve the rule associated with the given rule ID.
    Rule memory rule = _rules[ruleId];
    // Ensure that the rule exists and is active
    require(rule.period != 0, "Staking: rule does not exist");
    require(rule.active, "Staking: rule doesn't active");

    // check if user reached the maximum number of stakes, if it is revert transaction.
    if (_maxStake > 0) {
      require(_stakeCounter[_msgSender()] < _maxStake, "Staking: stake limit exceeded");
    }

    // Increment counters and set a new stake.
    _stakeIdCounter.increment();
    uint256 stakeId = _stakeIdCounter.current();
    _stakeCounter[_msgSender()] = _stakeCounter[_msgSender()] + 1;

    // UnimplementedFeatureError: Copying of type struct Asset memory[] memory to storage not yet supported.
    // _stakes[stakeId] = Stake(_msgSender(), rule.deposit, ruleId, block.timestamp, 0, true);

    // Store the new stake in the _stakes mapping.
    _stakes[stakeId].owner = _msgSender();
    _stakes[stakeId].ruleId = ruleId;
    _stakes[stakeId].startTimestamp = block.timestamp;
    _stakes[stakeId].cycles = 0;
    _stakes[stakeId].activeDeposit = true;

    emit StakingStart(stakeId, ruleId, _msgSender(), block.timestamp, tokenId);

    uint256 length = rule.deposit.length;
    for (uint256 i = 0; i < length; i++) {
      // Create a new Asset object representing the deposit.
      Asset memory depositItem = Asset(
        rule.deposit[i].tokenType,
        rule.deposit[i].token,
        tokenId,
        rule.deposit[i].amount
      );

      _stakes[stakeId].deposit.push(depositItem);

      // Check templateId if ERC721 or ERC998
      if (depositItem.tokenType == TokenType.ERC721 || depositItem.tokenType == TokenType.ERC998) {
        if (rule.deposit[i].tokenId != 0) {
          uint256 templateId = IERC721Metadata(depositItem.token).getRecordFieldValue(tokenId, TEMPLATE_ID);
          require(templateId == rule.deposit[i].tokenId, "Staking: wrong deposit token templateID");
        }
      }

      // Transfer tokens from user to this contract.
      spendFrom(_toArray(depositItem), _msgSender(), address(this));

      // Do something after purchase with refferer
      _afterPurchase(referrer, _toArray(depositItem));
    }
  }

  function _afterPurchase(address referrer, Asset[] memory price) internal override(LinearReferral) {
    return super._afterPurchase(referrer, price);
  }

  /**
   * @dev Allows the owner of the specified stake to receive the reward.
   * @param stakeId The ID of the stake.
   * @param withdrawDeposit Flag indicating whether the deposit should be withdrawn or not.
   * @param breakLastPeriod Flag indicating whether the last period should be broken or not.
   */
  function receiveReward(uint256 stakeId, bool withdrawDeposit, bool breakLastPeriod) public virtual whenNotPaused {
    // Retrieve the stake and rule objects from storage.
    Stake storage stake = _stakes[stakeId];
    address payable receiver = payable(stake.owner); // Set the receiver of the reward.
    Rule memory rule = _rules[stake.ruleId];
    // Verify that the stake exists and the caller is the owner of the stake.
    require(stake.owner != address(0), "Staking: wrong staking id");
    require(stake.owner == _msgSender(), "Staking: not an owner");
    require(stake.activeDeposit, "Staking: deposit withdrawn already");

    // Calculate the multiplier
    uint256 startTimestamp = stake.startTimestamp;
    uint256 stakePeriod = rule.period;
    uint256 multiplier = _calculateRewardMultiplier(startTimestamp, block.timestamp, stakePeriod);

    uint256 lengthDeposit = rule.deposit.length;
    for (uint256 i = 0; i < lengthDeposit; i++) {
      Asset memory depositItem = _stakes[stakeId].deposit[i];

      uint256 stakeAmount = depositItem.amount;

      // If withdrawDeposit is true, withdraw the deposit.
      if (withdrawDeposit) {
        emit StakingWithdraw(stakeId, receiver, block.timestamp);
        stake.activeDeposit = false;

        // Deduct the penalty from the stake amount if the multiplier is 0.
        depositItem.amount = multiplier == 0 ? (stakeAmount - (stakeAmount / 100) * (rule.penalty / 100)) : stakeAmount;

        // Transfer the deposit Asset to the receiver.
        spend(_toArray(depositItem), receiver);
      } else {
        // Update the start timestamp of the stake.
        stake.startTimestamp = block.timestamp;
      }
    }

    if (multiplier != 0) {
      // If the multiplier is not zero, it means that the staking period has ended and rewards can be issued.
      // Emit an event indicating that staking has finished.
      emit StakingFinish(stakeId, receiver, block.timestamp, multiplier);

      uint256 length = rule.reward.length;
      for (uint256 j = 0; j < length; j++) {
        // Create a new Asset object representing the reward.
        Asset memory rewardItem = Asset(
          rule.reward[j].tokenType,
          rule.reward[j].token,
          rule.reward[j].tokenId,
          rule.reward[j].amount * multiplier // Multiply the reward amount by the multiplier to calculate the total reward.
        );

        // Determine the token type of the reward and transfer the reward accordingly.
        if (rewardItem.tokenType == TokenType.ERC20 || rewardItem.tokenType == TokenType.NATIVE) {
          // If the token is an ERC20 or NATIVE token, transfer tokens to the receiver.
          spend(_toArray(rewardItem), receiver);
        } else if (rewardItem.tokenType == TokenType.ERC721 || rewardItem.tokenType == TokenType.ERC998) {
          // If the token is an ERC721 or ERC998 token, mint NFT to the receiver.
          for (uint256 k = 0; k < multiplier; k++) {
            if (IERC721Metadata(rewardItem.token).supportsInterface(IERC721_MYSTERY_ID)) {
              // If the token supports the MysteryBox interface, call the mintBox function to mint the tokens and transfer them to the receiver.
              IERC721Mysterybox(rewardItem.token).mintBox(receiver, rewardItem.tokenId, rule.content);
            } else {
              // If the token does not support the MysteryBox interface, call the acquire function to mint NFTs to the receiver.
              acquire(_toArray(rewardItem), receiver);
            }
          }
        } else {
          // If the token is an ERC1155 token, call the acquire function to transfer the tokens to the receiver.
          acquire(_toArray(rewardItem), receiver);
        }
      }
    }
    // If the multiplier is zero and the withdrawDeposit and breakLastPeriod flags are also false
    // revert the transaction.
    if (multiplier == 0 && !withdrawDeposit && !breakLastPeriod) revert("Staking: first period not yet finished");
  }

  /**
   * @dev Calculates the reward multiplier based on the duration of the staking period and the period length.
   * @param startTimestamp The start timestamp of the staking period.
   * @param finishTimestamp The finish timestamp of the staking period.
   * @param period The length of each staking period in seconds.
   * @return uint256 The reward multiplier, which is the number of periods completed during the staking period.
   */
  function _calculateRewardMultiplier(
    uint256 startTimestamp,
    uint256 finishTimestamp,
    uint256 period
  ) internal pure virtual returns (uint256) {
    return (finishTimestamp - startTimestamp) / period;
  }

  /**
   * @dev Pauses the contract.
   */
  function pause() public onlyRole(PAUSER_ROLE) {
    _pause();
  }

  /**
   * @dev Unpauses the contract.
   */
  function unpause() public onlyRole(PAUSER_ROLE) {
    _unpause();
  }

  /**
   * @dev See {IERC165-supportsInterface}.
   */
  function supportsInterface(bytes4 interfaceId) public view virtual override(AccessControl, Wallet) returns (bool) {
    return super.supportsInterface(interfaceId);
  }

  /**
   * @dev Rejects any incoming ETH transfers to this contract address
   */
  receive() external payable override {
    revert();
  }

  /**
   * @dev Sets the staking rules for the contract.
   * @param rules An array of `Rule` structs defining the staking rules.
   */
  function _setRules(Rule[] memory rules) internal {
    uint256 length = rules.length;
    for (uint256 i; i < length; i++) {
      _setRule(rules[i]);
    }
  }

  /**
   * @dev Add a new staking rule for the contract.
   * @param rule The staking rule to store.
   */
  function _setRule(Rule memory rule) internal {
    _ruleIdCounter.increment();
    uint256 ruleId = _ruleIdCounter.current();

    // UnimplementedFeatureError: Copying of type struct Asset memory[] memory to storage not yet supported.
    // _rules[ruleId] = rule

    // Store each individual property of the rule in storage
    Rule storage p = _rules[ruleId];

    // p.deposit = rule.deposit;
    // Store each individual asset in the rule's deposit array
    uint256 lengthDeposit = rule.deposit.length;
    for (uint256 i = 0; i < lengthDeposit; i++) {
      p.deposit.push(rule.deposit[i]);
    }
    // p.reward = rule.reward;
    // Store each individual asset in the rule's deposit array
    uint256 lengthReward = rule.reward.length;
    for (uint256 j = 0; j < lengthReward; j++) {
      p.reward.push(rule.reward[j]);
    }
    // p.content = rule.content;
    p.period = rule.period;
    p.penalty = rule.penalty;
    p.recurrent = rule.recurrent;
    p.active = rule.active;
    p.externalId = rule.externalId;

    // Store each individual asset in the rule's content array
    uint256 length = rule.content.length;
    for (uint256 i = 0; i < length; i++) {
      p.content.push(rule.content[i]);
    }

    emit RuleCreated(ruleId, rule, rule.externalId);
  }

  /**
   * @dev Updates the active state of a specific staking rule for the contract.
   * @param ruleId The ID of the rule to update.
   * @param active The new active state of the rule.
   */
  function _updateRule(uint256 ruleId, bool active) internal {
    Rule memory rule = _rules[ruleId];
    require(rule.period != 0, "Staking: rule does not exist");
    _rules[ruleId].active = active;
    emit RuleUpdated(ruleId, active);
  }
}
