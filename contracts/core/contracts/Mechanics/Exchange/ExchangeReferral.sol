// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/utils/Context.sol";

import "./SignatureValidator.sol";
import "./ExchangeUtils.sol";
import "./interfaces/IAsset.sol";

import "hardhat/console.sol";

abstract contract ExchangeReferral is Context {
  using EnumerableSet for EnumerableSet.AddressSet;

  event Reward(address from, address referrer, uint8 level, uint256 amount);

  mapping(address => EnumerableSet.AddressSet) private _forward;
  mapping(address => address) private _backward;
  mapping(address => uint256) private _balance;

  function _afterPurchase(Params memory params) internal virtual {
    updateReferrers(params.referrer);
  }

  function updateReferrers(address referrer) internal {
    if (referrer == address(0)) {
      return;
    }

    address account = _msgSender();
    _forward[referrer].add(account);
    _backward[account] = referrer;

    uint256 reward = 1 ether;
    uint8 level = 0;
    do {
      _balance[referrer] += reward;
      emit Reward(account, referrer, level, reward);
      reward /= 10**++level;
      referrer = _backward[referrer];
    } while (referrer != address(0));
  }
}
