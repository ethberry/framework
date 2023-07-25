// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "hardhat/console.sol";

import "../../utils/constants.sol";
import "../../Exchange/DiamondExchange/lib/ExchangeUtils.sol";

contract WaitList is AccessControl, Pausable {
  using Counters for Counters.Counter;

  mapping(uint256 => bytes32) internal _roots;
  mapping(uint256 => mapping(address => bool)) internal _expired;
  mapping(uint256 => Asset[]) internal _items;

  Counters.Counter internal _itemsCounter;

  event WaitListRewardSet(uint256 externalId, bytes32 root, Asset[] items);
  event WaitListRewardClaimed(address account, uint256 externalId, Asset[] items);

  constructor() {
    _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
    _grantRole(PAUSER_ROLE, _msgSender());
  }

  function setReward(Params memory params, Asset[] memory items) public onlyRole(DEFAULT_ADMIN_ROLE) {
    if (_roots[params.externalId] != "") {
      revert AlreadyExist();
    }

    _roots[params.externalId] = params.extra;

    if (items.length == 0) {
      revert WrongAmount();
    }

    uint256 length = items.length;
    for (uint256 i = 0; i < length; ) {
      _items[params.externalId].push(items[i]);
      unchecked {
        i++;
      }
    }

    emit WaitListRewardSet(params.externalId, params.extra, items);
  }

  function claim(bytes32[] calldata proof, uint256 externalId) public whenNotPaused {
    if (_roots[externalId] == "") {
      revert NotExist();
    }

    // should be
    // keccak256(abi.encodePacked(_msgSender()))
    bytes32 leaf = keccak256(bytes.concat(keccak256(abi.encode(_msgSender()))));
    bool verified = MerkleProof.verifyCalldata(proof, _roots[externalId], leaf);

    if (!verified) {
      revert NotInList();
    }

    if (_expired[externalId][_msgSender()]) {
      revert Expired();
    }

    _expired[externalId][_msgSender()] = true;

    ExchangeUtils.acquire(_items[externalId], _msgSender(), DisabledTokenTypes(false, false, false, false, false));

    emit WaitListRewardClaimed(_msgSender(), externalId, _items[externalId]);
  }

  function pause() public virtual onlyRole(PAUSER_ROLE) {
    _pause();
  }

  function unpause() public virtual onlyRole(PAUSER_ROLE) {
    _unpause();
  }
}
