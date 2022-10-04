// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import "./interfaces/IPyramid.sol";

abstract contract LinearReferralPyramid is Context, AccessControl {
  using SafeERC20 for IERC20;

  struct Ref {
    uint256 _refReward;
    uint256 _refDecrease;
    uint8 _maxRefs;
    bool init;
  }

  struct Bonus {
    address token;
    uint256 amount;
  }

  Ref public _refProgram;

  event ReferralProgram(Ref refProgram);
  event ReferralReward(address indexed account, address indexed referrer, uint8 level, address indexed token, uint256 amount);
  event ReferralWithdraw(address indexed account, address indexed token, uint256 amount);
  event ReferralBonus(address indexed referrer, address indexed token, uint256 amount);

  mapping(address => uint8) private _maxAccountRefs;
  mapping(address => address) private _chain;
  mapping(address => uint256) private _minTokenWithdrawalAmount;
  mapping(address => uint256) public _refCount;
  mapping(address => mapping (address => uint256)) _rewardBalances;
  mapping(uint256 => Bonus) _referralBonuses;

  bool _autoWithdrawal = false;

  function setRefProgram(uint8 maxRefs, uint256 refReward, uint256 refDecrease) public onlyRole(DEFAULT_ADMIN_ROLE) {
    require (!_refProgram.init, "Referral: program already set");
    require (refReward >= 0 && refReward < 10000, "Referral: wrong refReward");
    _refProgram = Ref(refReward, refDecrease, maxRefs, true);
    emit ReferralProgram(_refProgram);
  }

  function getRefProgram() public view returns(Ref memory) {
    return _refProgram;
  }

  function _afterPurchase(address referrer, Asset[] memory price) internal virtual {
    updateReferrers(referrer, price);

    if (_autoWithdrawal) {
        Asset memory ingredient = price[0];
        uint256 rewardAmount = _rewardBalances[referrer][ingredient.token];

        if(rewardAmount > 0 && rewardAmount >= _minTokenWithdrawalAmount[ingredient.token]) {
          withdrawAutoReward(ingredient.token, referrer);
        }
    }
  }

  function updateReferrers(address initReferrer, Asset[] memory price) internal {
    address account = _msgSender();

    if (initReferrer == address(0) || initReferrer == account) {
      return;
    }

    _chain[account] = initReferrer;

    Ref memory program = _refProgram;

    uint256 length = price.length;
    for (uint256 i = 0; i < length; i++) {
          Asset memory ingredient = price[i];
          if (ingredient.tokenType == TokenType.NATIVE || ingredient.tokenType == TokenType.ERC20) {
            address referrer = initReferrer;

            uint8 maxRefs = _maxAccountRefs[account] > 0 ? _maxAccountRefs[account] : program._maxRefs;
            for (uint8 level = 0; level < maxRefs; level++) {

              uint256 rewardAmount = ((ingredient.amount / 100) * (program._refReward / 100)) / program._refDecrease**(level);
              _rewardBalances[referrer][ingredient.token] += rewardAmount;
              getBonus(referrer);
              emit ReferralReward(account, referrer, level, ingredient.token, rewardAmount);

              address nxt = _chain[referrer];

              if (_chain[referrer] == address(0) || _chain[referrer] == account) {
                level = maxRefs;
              }
              referrer = nxt;
            }
          }
        }
  }

  function withdrawReward(address token) public returns (bool success) {
    address account = _msgSender();
    uint256 rewardAmount = _rewardBalances[account][token];
    require(rewardAmount > 0, "Referral: Zero balance");
    bool result;
    if (token == address(0)) {
      require(address(this).balance > rewardAmount, "Referral: Insufficient ETH balance");
      _rewardBalances[account][token] = 0;
      emit ReferralWithdraw(account, token, rewardAmount);
      Address.sendValue(payable(account), rewardAmount);
      result = true;
    } else {
      uint256 balanceErc20 = IERC20(token).balanceOf(address(this));
      require(balanceErc20 > rewardAmount, "Referral: Insufficient ERC20 balance");
      _rewardBalances[account][token] = 0;
      emit ReferralWithdraw(account, token, rewardAmount);
      SafeERC20.safeTransfer(IERC20(token), account, rewardAmount);
      result = true;
    }
    return result;
  }

  function withdrawAutoReward(address token, address referrer) internal returns (bool success) {
    uint256 rewardAmount = _rewardBalances[referrer][token];
    require(rewardAmount > 0, "Referral: Zero balance");
    bool result;
    if (token == address(0)) {
      require(address(this).balance > rewardAmount, "Referral: Insufficient ETH balance");
      _rewardBalances[referrer][token] = 0;
      emit ReferralWithdraw(referrer, token, rewardAmount);
      Address.sendValue(payable(referrer), rewardAmount);
      result = true;
    } else {
      uint256 balanceErc20 = IERC20(token).balanceOf(address(this));
      require(balanceErc20 > rewardAmount, "Referral: Insufficient ERC20 balance");
      _rewardBalances[referrer][token] = 0;
      emit ReferralWithdraw(referrer, token, rewardAmount);
      SafeERC20.safeTransfer(IERC20(token), referrer, rewardAmount);
      result = true;
    }
    return result;
  }

  function getBalance(address referral, address token) public view returns (uint256 balance) {
    return _rewardBalances[referral][token];
  }

  function setRefBonus(uint256[] memory tokenCounts, uint256[] memory bonusAmounts, address[] memory tokens) internal {
    uint256 tokensLength = tokenCounts.length;
    uint256 bonusLength = bonusAmounts.length;
    uint256 tokenLength = tokens.length;
    require(tokensLength == bonusLength && bonusLength == tokenLength, "Referral: wrong arrays");
    for (uint256 indx = 0; indx < tokensLength; indx++) {
      _referralBonuses[tokenCounts[indx]] = Bonus(tokens[indx], bonusAmounts[indx]);
    }
  }

  function getBonus(address referrer) internal {
    uint256 refcount = _refCount[referrer] += 1;
    Bonus memory _bonus = _referralBonuses[refcount];

    if(_bonus.amount > 0 ) {
      _rewardBalances[referrer][_bonus.token] += _bonus.amount;
      emit ReferralBonus(referrer, _bonus.token, _bonus.amount);
    }
  }

  function setAutoWithdrawal(bool autoWithdrawal) public onlyRole(DEFAULT_ADMIN_ROLE) {
    _autoWithdrawal = autoWithdrawal;
  }

  function setAccountMaxRefs(address account, uint8 maxRef) public onlyRole(DEFAULT_ADMIN_ROLE) {
    require(maxRef > 0, "Referral: wrong maxRef");
    _maxAccountRefs[account] = maxRef;
  }

  function setMinWithdrawal(address token, uint256 amount) public onlyRole(DEFAULT_ADMIN_ROLE) {
    _minTokenWithdrawalAmount[token] = amount;
  }
}