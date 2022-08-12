// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Context.sol";

import "./SignatureValidator.sol";
import "./ExchangeUtils.sol";
import "./interfaces/IAsset.sol";

import "hardhat/console.sol";

abstract contract ExchangeReferral is Context {
  event ReferralReward(address indexed account, address indexed referrer, uint8 level, uint256 amount);
  event ReferralWithdraw(address indexed account, uint256 amount);

  mapping(address => address) private _chain;
  mapping(address => uint256) private _balance;

  uint8 _maxRef = 10; // Max referrals chain length

  function _afterPurchase(Params memory params) internal virtual {
    updateReferrers(params.referrer);
  }

  function updateReferrers(address referrer) internal {
    if (referrer == address(0)) {
      return;
    }

    address account = _msgSender();
    _chain[account] = referrer;

    uint256 reward = 1 ether;

    for (uint8 level = 0; level < _maxRef; level++) {
      emit ReferralReward(account, referrer, level, reward);
      _balance[referrer] += reward;
      reward /= 10**++level;

      address nxt = _chain[referrer];

      if (_chain[referrer] == address(0)) {
        level = _maxRef;
      }

      if (_chain[referrer] == account) {
        level = _maxRef;
      }
      referrer = nxt;
    }
  }

  function withdraw() public returns (bool success) {
    address account = _msgSender();
    uint256 amount = _balance[account];
    require(amount > 0, "ExchangeReferral: Zero balance");
    _balance[account] = 0;
    emit ReferralWithdraw(account, amount);
    Address.sendValue(payable(account), amount);
    return true;
  }

  function getBalance(address referral) public view returns (uint256 amount) {
    return _balance[referral];
  }
}
