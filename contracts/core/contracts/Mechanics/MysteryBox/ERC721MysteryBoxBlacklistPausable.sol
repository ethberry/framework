// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/security/Pausable.sol";

import "@gemunion/contracts-misc/contracts/constants.sol";
import "./ERC721MysteryBoxBlacklist.sol";

contract ERC721MysteryBoxBlacklistPausable is ERC721MysteryBoxBlacklist, Pausable {
  constructor(
    string memory name,
    string memory symbol,
    uint96 royalty,
    string memory baseTokenURI
  ) ERC721MysteryBoxBlacklist(name, symbol, royalty, baseTokenURI) {
    _grantRole(PAUSER_ROLE, _msgSender());
  }

  function pause() public onlyRole(PAUSER_ROLE) {
    _pause();
  }

  function unpause() public onlyRole(PAUSER_ROLE) {
    _unpause();
  }

  /**
   * @dev See {ERC721-_beforeTokenTransfer}.
   *
   * Requirements:
   *
   * - the contract must not be paused.
   */
  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 firstTokenId,
    uint256 batchSize
  ) internal virtual override whenNotPaused {
    super._beforeTokenTransfer(from, to, firstTokenId, batchSize);
  }
}
