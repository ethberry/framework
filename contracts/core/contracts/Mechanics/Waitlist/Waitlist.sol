// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "../../utils/constants.sol";
import "../../Exchange/ExchangeUtils.sol";
import "../../Exchange/interfaces/IAsset.sol";

contract Waitlist is AccessControl, Pausable {
  using Counters for Counters.Counter;
  using MerkleProof for bytes32[];

  mapping(uint256 => bytes32) internal _roots;
  mapping(uint256 => mapping(address => bool)) internal _expired;
  mapping(uint256 => Asset[]) internal _items;

  Counters.Counter internal _itemsCounter;

  event RewardSet(uint256 externalId, Asset[] items);
  event ClaimReward(address from, uint256 externalId, Asset[] items);

  constructor() {
    _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
    _setupRole(PAUSER_ROLE, _msgSender());
  }

  function setReward(bytes32 root, Asset[] memory items, uint256 externalId) public onlyRole(DEFAULT_ADMIN_ROLE) {
    require(_roots[externalId] == "", "Waitlist: Reward already set");
    // TODO add sol function for addReward or changeReward
    _roots[externalId] = root;

    uint256 length = items.length;
    for (uint256 i = 0; i < length; ) {
      _items[externalId].push(items[i]);
      unchecked {
        i++;
      }
    }

    emit RewardSet(externalId, _items[externalId]);
  }

  function updateReward(bytes32 root, Asset[] memory items, uint256 externalId) public onlyRole(DEFAULT_ADMIN_ROLE) {
    require(_roots[externalId] != "", "Waitlist: Reward not yet set");
    delete _items[externalId];
    _roots[externalId] = root;

    uint256 length = items.length;
    for (uint256 i = 0; i < length; ) {
      _items[externalId].push(items[i]);
      unchecked {
        i++;
      }
    }

    emit RewardSet(externalId, _items[externalId]);
  }

  function claim(bytes32[] memory proof, uint256 externalId) public whenNotPaused {
    require(_roots[externalId] != "", "Waitlist: Not yet started");

    address account = _msgSender();
    require(!_expired[externalId][account], "Witlist: Reward already claimed");
    _expired[externalId][account] = true;

    //    bool verified = proof.verify(_roots[externalId], keccak256(abi.encodePacked(account)));
    bool verified = proof.verify(_roots[externalId], keccak256(bytes.concat(keccak256(abi.encode(account)))));

    require(verified, "Waitlist: You are not in the wait list");

    ExchangeUtils.acquire(_items[externalId], account, DisabledTokenTypes(false, false, false, false, false));

    emit ClaimReward(account, externalId, _items[externalId]);
  }

  function pause() public virtual onlyRole(PAUSER_ROLE) {
    _pause();
  }

  function unpause() public virtual onlyRole(PAUSER_ROLE) {
    _unpause();
  }
}
