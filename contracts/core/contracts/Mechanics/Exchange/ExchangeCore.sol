// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

import "./SignatureValidator.sol";
import "./ExchangeUtils.sol";
import "./interfaces/IAsset.sol";

abstract contract ExchangeCore is SignatureValidator, ExchangeUtils, AccessControl, Pausable {
  event Purchase(address from, uint256 externalId, Asset item, Asset[] price);

  function purchase(
    Params memory params,
    Asset memory item,
    Asset[] memory price,
    address signer,
    bytes calldata signature
  ) external payable whenNotPaused {
    require(hasRole(MINTER_ROLE, signer), "Exchange: Wrong signer");
    _verifyOneToManySignature(params, item, price, signer, signature);

    address account = _msgSender();

    spend(price, account);
    acquire(toArray(item), account);

    emit Purchase(account, params.externalId, item, price);
  }

  using EnumerableSet for EnumerableSet.AddressSet;

  mapping(address => EnumerableSet.AddressSet) private _forward;
  mapping(address => address) private _backward;
  mapping(address => uint256) private _balance;

  function updateReferral(address referral) public {
    if (referral == address(0)) {
      return;
    }

    address account = _msgSender();
    _forward[referral].add(account);
    _backward[account] = referral;

    uint256 award = 1 ether;
    do {
      _balance[referral] += award;
      award /= 10;
      referral = _backward[referral];
    } while (referral != address(0));
  }
}
