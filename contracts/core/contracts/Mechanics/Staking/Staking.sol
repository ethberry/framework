// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableMap.sol";

import "@gemunion/contracts-mocks/contracts/Wallet.sol";

import "../../ERC721/interfaces/IERC721Random.sol";
import "../../ERC721/interfaces/IERC721Simple.sol";
import "../../ERC1155/interfaces/IERC1155Simple.sol";
import "../../ERC721/interfaces/IERC721Metadata.sol";
import "../../Exchange/referral/LinearReferral.sol";
import "../../Exchange/ExchangeUtils.sol";
import "../../utils/constants.sol";
import "../../utils/TopUp.sol";
import "../../utils/errors.sol";
import "../Mysterybox/interfaces/IERC721Mysterybox.sol";
import "./interfaces/IStaking.sol";

/**
 * @dev This contract implements a staking system where users can stake their tokens for a specific period of time
 * and receive rewards based on a set of predefined rules. Users can stake multiple times, and each stake creates a
 * new deposit with a unique stake ID. The rewards can be paid out in NATIVE, ERC20, ERC721, ERC998, or ERC1155 tokens.
 * The contract owner can set and update the rules for the staking system, as well as deposit and withdraw funds.
 * The staking contract is pausable in case of emergency situations or for maintenance purposes.
 */
contract Staking is IStaking, AccessControl, Pausable, TopUp, Wallet, LinearReferral, ReentrancyGuard {
  using Address for address;
  using Counters for Counters.Counter;
  using EnumerableMap for EnumerableMap.AddressToUintMap;

  Counters.Counter internal _ruleIdCounter;
  Counters.Counter internal _stakeIdCounter;

  EnumerableMap.AddressToUintMap internal _depositBalancesMap;

  mapping(uint256 => Rule) internal _rules;
  mapping(uint256 => Stake) internal _stakes;

  mapping(address /* contract */ => mapping(uint256 /* tokenId */ => uint256 /* amount */)) internal _penalties;

  uint256 private _maxStake = 0;
  mapping(address => uint256) internal _stakeCounter;

  DisabledTokenTypes _disabledTypes = DisabledTokenTypes(false, false, false, false, false);

  event StakingStart(uint256 stakingId, uint256 ruleId, address owner, uint256 startTimestamp, uint256[] tokenIds);

  event StakingWithdraw(uint256 stakingId, address owner, uint256 withdrawTimestamp);
  event StakingFinish(uint256 stakingId, address owner, uint256 finishTimestamp, uint256 multiplier);
  event WithdrawBalance(address account, Asset item);
  event ReturnDeposit(uint256 stakingId, address owner);

  constructor(uint256 maxStake) {
    _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
    _grantRole(PAUSER_ROLE, _msgSender());

    setMaxStake(maxStake);
  }

  /**
   * @dev Deposit function allows a user to stake a specified token with a given rule.
   * @param params Struct of Params that containing the ruleId and referrer parameters.
   * @param tokenIds - Array<id> of the tokens to be deposited.
   */
  function deposit(Params memory params, uint256[] calldata tokenIds) public payable whenNotPaused {
    // Retrieve the rule params.
    uint256 ruleId = params.externalId;
    address referrer = params.referrer;
    // Retrieve the rule associated with the given rule ID.
    Rule storage rule = _rules[ruleId];
    // Ensure that the rule exists and is active
    if (rule.period == 0) {
      revert NotExist();
    }
    if (!rule.active) {
      revert NotActive();
    }

    // check if user reached the maximum number of stakes, if it is revert transaction.
    if (_maxStake > 0) {
      if (_stakeCounter[_msgSender()] >= _maxStake) {
        revert LimitExceed();
      }
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

    emit StakingStart(stakeId, ruleId, _msgSender(), block.timestamp, tokenIds);

    uint256 length = rule.deposit.length;
    if (length > 0) {
      for (uint256 i = 0; i < length; ) {
        // Create a new Asset object representing the deposit.
        Asset memory depositItem = Asset(
          rule.deposit[i].tokenType,
          rule.deposit[i].token,
          tokenIds[i],
          rule.deposit[i].amount
        );

        _stakes[stakeId].deposit.push(depositItem);

        // Check templateId if ERC721 or ERC998
        if (depositItem.tokenType == TokenType.ERC721 || depositItem.tokenType == TokenType.ERC998) {
          // Rule deposit tokenId
          uint256 ruleDepositTokenTemplateId = rule.deposit[i].tokenId;

          if (ruleDepositTokenTemplateId != 0) {
            uint256 templateId = IERC721Metadata(depositItem.token).getRecordFieldValue(tokenIds[i], TEMPLATE_ID);
            if (templateId != ruleDepositTokenTemplateId) {
              revert WrongToken();
            }
          }
        }

        // Transfer tokens from user to this contract.
        ExchangeUtils.spendFrom(ExchangeUtils._toArray(depositItem), _msgSender(), address(this), _disabledTypes);
        // Save deposit balance
        (, uint256 balance) = _depositBalancesMap.tryGet(depositItem.token);
        _depositBalancesMap.set(depositItem.token, balance + depositItem.amount);

        // Do something with referrer
        if (referrer != address(0)) {
          _afterPurchase(referrer, ExchangeUtils._toArray(depositItem));
        }

        unchecked {
          i++;
        }
      }
    }
  }

  /* Receive Staking Reward logic:

    1. Calculate multiplier (count full periods since stake start)

    2. Deposit withdraw
      2.1 If withdrawDeposit || ( multiplier > 0 && !rule.recurrent ) || ( stake.cycles > 0 && breakLastPeriod )

        2.1.1 If multiplier == 0                       -> deduct penalty from deposit amount
        2.1.2 Transfer deposit to user account         -> spend(_toArray(depositItem), receiver)

      2.2 Else -> update stake.startTimestamp = block.timestamp

    3. Reward transfer
      3.1 If multiplier > 0                            -> transfer reward amount * multiplier to receiver

    4. If multiplier == 0 && rule.recurrent && !withdrawDeposit && !breakLastPeriod
                                                       -> revert with Error ( first period not yet finished )
    */

  /**
   * @dev Allows the owner of the specified stake to receive the reward.
   * @param stakeId The ID of the stake.
   * @param withdrawDeposit Flag indicating whether the deposit should be withdrawn or not.
   * @param breakLastPeriod Flag indicating whether the last period should be broken or not.
   */
  function receiveReward(
    uint256 stakeId,
    bool withdrawDeposit,
    bool breakLastPeriod
  ) public virtual nonReentrant whenNotPaused {
    // Retrieve the stake and rule objects from storage.
    Stake storage stake = _stakes[stakeId];
    Rule storage rule = _rules[stake.ruleId];

    uint256 startTimestamp = stake.startTimestamp;
    // Set the receiver of the reward.
    address payable receiver = payable(stake.owner);

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

    uint256 stakePeriod = rule.period;
    // Calculate the multiplier
    // counts only FULL stake cycles
    uint256 multiplier = _calculateRewardMultiplier(startTimestamp, block.timestamp, stakePeriod, rule.recurrent);

    // Increment stake's cycle count
    if (multiplier != 0) {
      stake.cycles += multiplier;
    }

    // Iterate by Array<deposit>
    uint256 lengthDeposit = stake.deposit.length;
    for (uint256 i = 0; i < lengthDeposit; ) {
      // If withdrawDeposit flag is true OR
      // If Reward multiplier > 0 AND Rule is not recurrent OR
      // If Stake cycles > 0 AND breakLastPeriod flag is true
      // Withdraw initial Deposit
      if (withdrawDeposit || (multiplier > 0 && !rule.recurrent) || (stake.cycles > 0 && breakLastPeriod)) {
        emit StakingWithdraw(stakeId, receiver, block.timestamp);
        // Deactivate current deposit
        stake.activeDeposit = false;

        withdrawDepositItem(stakeId, i, multiplier, receiver);
      } else {
        // Update the start timestamp of the stake.
        stake.startTimestamp = block.timestamp;
      }

      unchecked {
        i++;
      }
    }

    // If the multiplier is not zero, it means that the staking period has ended and rewards can be issued.
    if (multiplier > 0) {
      // Emit an event indicating that staking has finished.
      emit StakingFinish(stakeId, receiver, block.timestamp, multiplier);

      // Iterate by Array<reward>
      uint256 lengthReward = rule.reward.length;
      for (uint256 j = 0; j < lengthReward; ) {
        // Transfer the reward.
        withdrawRewardItem(stakeId, j, multiplier, receiver);

        unchecked {
          j++;
        }
      }
    }
    // IF the multiplier is zero
    // AND
    // withdrawDeposit and breakLastPeriod flags are false
    // AND staking rule is recurrent
    // revert the transaction.
    if (multiplier == 0 && rule.recurrent && !withdrawDeposit && !breakLastPeriod) {
      revert NotComplete();
    }
  }

  /**
   * @dev Withdraw Deposit Item.
   * @param stakeId The ID of the stake.
   * @param itemIndex The Index of the Deposit Item.
   * @param multiplier The full stake cycles count.
   * @param receiver The Deposit's receiver.
   */
  function withdrawDepositItem(uint256 stakeId, uint256 itemIndex, uint256 multiplier, address receiver) internal {
    // Retrieve the stake objects from storage.
    Stake storage stake = _stakes[stakeId];
    Rule storage rule = _rules[stake.ruleId];
    Asset storage depositItem = stake.deposit[itemIndex];
    uint256 stakeAmount = depositItem.amount;
    TokenType depositTokenType = depositItem.tokenType;
    uint256 penalty = rule.penalty;

    // Deduct the penalty from the stake deposit amount if the multiplier is 0.
    if (multiplier == 0 && stake.cycles == 0) {
      uint256 penaltyDeposit = (stakeAmount / 100) * (penalty / 100);

      if (penaltyDeposit > 0) {
        depositItem.amount = stakeAmount - penaltyDeposit;
        // Store penalties
        _penalties[depositItem.token][depositItem.tokenId] += penaltyDeposit;
        // Update deposit balance
        if (depositTokenType == TokenType.ERC20 || depositTokenType == TokenType.NATIVE) {
          // Deduct deposit balance
          (, uint256 balance) = _depositBalancesMap.tryGet(depositItem.token);
          _depositBalancesMap.set(depositItem.token, balance - penaltyDeposit);
        }
      }
    }

    // Penalty for ERC721\ERC998 deposit either 0% or 100%
    if (
      multiplier == 0 &&
      penalty == 10000 &&
      (depositTokenType == TokenType.ERC721 || depositTokenType == TokenType.ERC998)
    ) {
      // Empty current stake deposit item amount
      depositItem.amount = 0;
      // Set penalty amount
      _penalties[depositItem.token][depositItem.tokenId] = 1;
    } else {
      if (depositItem.amount > 0) {
        Asset memory depositItemWithdraw = depositItem;
        // Empty current stake deposit storage
        depositItem.amount = 0;
        // Transfer the deposit Asset to the receiver.
        ExchangeUtils.spend(ExchangeUtils._toArray(depositItemWithdraw), receiver, _disabledTypes);

        if (depositTokenType == TokenType.ERC20 || depositTokenType == TokenType.NATIVE) {
          // Deduct deposit balance
          (, uint256 balance) = _depositBalancesMap.tryGet(depositItemWithdraw.token);
          _depositBalancesMap.set(depositItemWithdraw.token, balance - depositItemWithdraw.amount);
        }
      }
    }
  }

  /**
   * @dev Withdraw Reward Item.
   * @param stakeId The ID of the stake.
   * @param itemIndex The Index of the Reward Item.
   * @param multiplier The full stake cycles count.
   * @param receiver The Deposit's receiver.
   */
  function withdrawRewardItem(uint256 stakeId, uint256 itemIndex, uint256 multiplier, address receiver) internal {
    // Retrieve the stake and rule objects from storage.
    Stake storage stake = _stakes[stakeId];
    Rule storage rule = _rules[stake.ruleId];
    Asset storage reward = rule.reward[itemIndex];

    // Create a new Asset object representing the reward.
    Asset memory rewardItem = Asset(
      reward.tokenType,
      reward.token,
      reward.tokenId,
      reward.amount * multiplier // Multiply the reward amount by the multiplier to calculate the total reward.
    );

    // Determine the token type of the reward and transfer the reward accordingly.
    if (rewardItem.tokenType == TokenType.ERC20 || rewardItem.tokenType == TokenType.NATIVE) {
      // If the token is an ERC20 or NATIVE token, transfer tokens to the receiver.

      // Check contract balance
      bool balanceCheck = checkBalance(rewardItem);
      // If contract balance is enough - transfer reward
      if (balanceCheck) {
        ExchangeUtils.spend(ExchangeUtils._toArray(rewardItem), receiver, _disabledTypes);
      } else {
        // If contract balance is not enough for reward - emergency return deposit to receiver
        returnDeposit(stakeId, receiver);
      }
    } else if (rewardItem.tokenType == TokenType.ERC721 || rewardItem.tokenType == TokenType.ERC998) {
      // If the token is an ERC721 or ERC998 token, mint NFT to the receiver.
      for (uint256 k = 0; k < multiplier; ) {
        if (IERC721Metadata(rewardItem.token).supportsInterface(IERC721_MYSTERY_ID)) {
          // If the token supports the MysteryBox interface, call the mintBox function to mint the tokens and transfer them to the receiver.
          IERC721Mysterybox(rewardItem.token).mintBox(receiver, rewardItem.tokenId, rule.content[itemIndex]);
        } else {
          // If the token does not support the MysteryBox interface, call the acquire function to mint NFTs to the receiver.
          ExchangeUtils.acquire(ExchangeUtils._toArray(rewardItem), receiver, _disabledTypes);
        }
        unchecked {
          k++;
        }
      }
    } else if (rewardItem.tokenType == TokenType.ERC1155) {
      // If the token is an ERC1155 token, call the acquire function to transfer the tokens to the receiver.
      ExchangeUtils.acquire(ExchangeUtils._toArray(rewardItem), receiver, _disabledTypes);
    } else {
      // should never happen
      revert UnsupportedTokenType();
    }
  }

  /**
   * @dev Return entire Deposit without penalty.
   * @param stakeId The ID of the stake.
   * @param receiver The Deposit's receiver.
   */
  function returnDeposit(uint256 stakeId, address receiver) internal {
    emit ReturnDeposit(stakeId, receiver);

    // Retrieve the stake and rule objects from storage.
    Stake storage stake = _stakes[stakeId];
    Asset[] storage stakeDeposit = stake.deposit;

    emit StakingWithdraw(stakeId, receiver, block.timestamp);
    // Deactivate current deposit
    stake.activeDeposit = false;

    // Iterate by Array<deposit>
    uint256 lengthDeposit = stakeDeposit.length;

    for (uint256 m = 0; m < lengthDeposit; ) {
      Asset storage depositItem = stakeDeposit[m];

      if (depositItem.amount > 0) {
        Asset memory depositItemWithdraw = depositItem;
        // Empty current stake deposit storage
        depositItem.amount = 0;
        // Transfer the deposit Asset to the receiver.
        ExchangeUtils.spend(ExchangeUtils._toArray(depositItemWithdraw), receiver, _disabledTypes);
        if (depositItem.tokenType == TokenType.ERC20 || depositItem.tokenType == TokenType.NATIVE) {
          // Deduct deposit balance
          (, uint256 balance) = _depositBalancesMap.tryGet(depositItemWithdraw.token);
          _depositBalancesMap.set(depositItemWithdraw.token, balance - depositItemWithdraw.amount);
        }
      }
      unchecked {
        m++;
      }
    }
  }

  /**
   * @dev Check contract and deposit balance.
   * @param rewardItem The Reward item.
   * @return bool True if balance is enough.
   */
  function checkBalance(Asset memory rewardItem) internal view returns (bool) {
    // Get deposit balance
    (, uint256 depositBalance) = _depositBalancesMap.tryGet(rewardItem.token);
    // Get contract balance
    uint256 contractBalance = rewardItem.tokenType == TokenType.NATIVE
      ? address(this).balance
      : IERC20(rewardItem.token).balanceOf(address(this));

    return rewardItem.amount <= contractBalance - depositBalance;
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
    uint256 period,
    bool recurrent
  ) internal pure virtual returns (uint256) {
    if (startTimestamp <= finishTimestamp) {
      uint256 multiplier = (finishTimestamp - startTimestamp) / period;
      // If staking rule is not recurrent, limit reward to 1 cycle
      if (!recurrent && multiplier > 1) {
        return 1;
      }
      return multiplier;
    } else return 0;
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
   * @dev Sets maxStake
   */
  function setMaxStake(uint256 maxStake) public onlyRole(DEFAULT_ADMIN_ROLE) {
    _maxStake = maxStake;
  }

  /**
   * @dev Sets the staking rules for the contract.
   * @param rules An array of `Rule` structs defining the staking rules.
   */
  function _setRules(Rule[] memory rules) internal {
    uint256 length = rules.length;
    for (uint256 i; i < length; ) {
      _setRule(rules[i]);
      unchecked {
        i++;
      }
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
    if (lengthDeposit == 0) {
      revert WrongRule();
    }
    for (uint256 i = 0; i < lengthDeposit; ) {
      p.deposit.push(rule.deposit[i]);
      unchecked {
        i++;
      }
    }
    // p.reward = rule.reward;
    // Store each individual asset in the rule's deposit array
    uint256 lengthReward = rule.reward.length;
    for (uint256 j = 0; j < lengthReward; ) {
      p.reward.push(rule.reward[j]);
      unchecked {
        j++;
      }
    }

    // p.content = rule.content;
    // Store each individual asset in the rule's content array
    uint256 len = rule.content.length;
    for (uint256 k = 0; k < len; ) {
      p.content.push();
      uint256 length = rule.content[k].length;
      for (uint256 l = 0; l < length; ) {
        p.content[k].push(rule.content[k][l]);
        unchecked {
          l++;
        }
      }
      unchecked {
        k++;
      }
    }

    p.period = rule.period;
    p.penalty = rule.penalty;
    p.recurrent = rule.recurrent;
    p.active = rule.active;

    emit RuleCreated(ruleId, rule);
  }

  /**
   * @dev Updates the active state of a specific staking rule for the contract.
   * @param ruleId The ID of the rule to update.
   * @param active The new active state of the rule.
   */
  function _updateRule(uint256 ruleId, bool active) internal {
    Rule storage rule = _rules[ruleId];
    if (rule.period == 0) {
      revert NotExist();
    }
    _rules[ruleId].active = active;
    emit RuleUpdated(ruleId, active);
  }

  /**
   * @dev Referral calculations.
   * @param referrer The Referrer address.
   * @param price The deposited Asset[].
   */
  function _afterPurchase(address referrer, Asset[] memory price) internal override(LinearReferral) {
    return super._afterPurchase(referrer, price);
  }

  /**
   * @dev Get Stake
   */
  function getStake(uint256 stakeId) public view returns (Stake memory stake) {
    return _stakes[stakeId];
  }

  /**
   * @dev Get Rule
   */
  function getRule(uint256 ruleId) public view returns (Rule memory rule) {
    return _rules[ruleId];
  }

  /**
   * @dev Get Penalty
   */
  function getPenalty(address token, uint256 tokenId) public view returns (uint256 penalty) {
    return _penalties[token][tokenId];
  }

  /**
   * @dev Get Deposit balance
   */
  function getDepositBalance(address token) public view returns (uint256) {
    (, uint256 balance) = _depositBalancesMap.tryGet(token);
    return balance;
  }

  // WITHDRAW

  /**
   * @dev Withdraw the penalty balance for given token address and tokenId
   * @param item asset to withdraw.
   */
  function withdrawBalance(Asset memory item) public nonReentrant onlyRole(DEFAULT_ADMIN_ROLE) {
    // Retrieve balance from storage.
    item.amount = _penalties[item.token][item.tokenId];
    if (item.amount == 0) {
      revert ZeroBalance();
    }

    // Emit an event indicating that penalty balance has withdrawn.
    emit WithdrawBalance(_msgSender(), item);
    // clean penalty balance in _penalties mapping storage
    _penalties[item.token][item.tokenId] = 0;

    ExchangeUtils.spend(ExchangeUtils._toArray(item), _msgSender(), _disabledTypes);
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
  function supportsInterface(
    bytes4 interfaceId
  ) public view virtual override(AccessControl, Wallet, TopUp) returns (bool) {
    return super.supportsInterface(interfaceId);
  }

  /**
   * @notice No tipping!
   * @dev Rejects any incoming ETH transfers
   */
  receive() external payable override(Wallet, TopUp) {
    revert();
  }
}
