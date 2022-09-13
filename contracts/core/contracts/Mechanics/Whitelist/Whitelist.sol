// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

import "../Exchange/ExchangeUtils.sol";

contract Whitelist is ExchangeUtils, AccessControl, Pausable {
  event Claim(address from, Asset[] items);

  using MerkleProof for bytes32[];
  bytes32 _root;

  Asset[] private _items;

  bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

  constructor() {
    _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
    _setupRole(PAUSER_ROLE, _msgSender());
  }

  function setReward(bytes32 root, Asset[] memory items) public onlyRole(DEFAULT_ADMIN_ROLE) {
    _root = root;

    // UnimplementedFeatureError: Copying of type struct Asset memory[] memory to storage not yet supported.
    // _items = items;

    uint256 length = items.length;
    for (uint256 i = 0; i < length; i++) {
      _items[i] = items[i];
    }
  }

  function claim(bytes32[] memory proof) public whenNotPaused {
    require(_root == 0, "Not yet started");

    address account = _msgSender();

    require(proof.verify(_root, keccak256(abi.encodePacked(account))), "You are not in the list");

    acquire(_items, account);

    emit Claim(account, _items);
  }

  function pause() public virtual onlyRole(PAUSER_ROLE) {
    _pause();
  }

  function unpause() public virtual onlyRole(PAUSER_ROLE) {
    _unpause();
  }
}
