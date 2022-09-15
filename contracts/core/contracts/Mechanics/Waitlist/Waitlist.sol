// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "../Exchange/ExchangeUtils.sol";
import "../Exchange/interfaces/IAsset.sol";

contract Waitlist is ExchangeUtils, AccessControl, Pausable {
  using Counters for Counters.Counter;
  using MerkleProof for bytes32[];

  mapping(uint256 => bytes32) internal _roots;
  mapping(uint256 => Asset[]) internal _items;

  Counters.Counter internal _itemsCounter;

  event RewardSet(uint256 externalId, Asset[] items);
  event ClaimReward(address from, uint256 externalId, Asset[] items);

  bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

  constructor() {
    _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
    _setupRole(PAUSER_ROLE, _msgSender());
  }

  function setReward(bytes32 root, Asset[] memory items, uint256 externalId) public onlyRole(DEFAULT_ADMIN_ROLE) {
    _roots[externalId] = root;

    uint256 length = items.length;
    for (uint256 i = 0; i < length; i++) {
      _items[externalId].push(items[i]);
    }

    emit RewardSet(externalId, _items[externalId]);
  }

  function claim(bytes32[] memory proof, uint256 externalId) public whenNotPaused {
    require(_roots[externalId] == 0, "Not yet started");

    address account = _msgSender();

    require(proof.verify(_roots[externalId], keccak256(abi.encodePacked(account))), "You are not in the wait list");

    acquire(_items[externalId], account);

    emit ClaimReward(account, externalId, _items[externalId]);
  }

  function pause() public virtual onlyRole(PAUSER_ROLE) {
    _pause();
  }

  function unpause() public virtual onlyRole(PAUSER_ROLE) {
    _unpause();
  }
}
