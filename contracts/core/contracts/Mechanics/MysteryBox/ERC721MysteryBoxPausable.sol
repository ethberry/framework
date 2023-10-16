// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/Pausable.sol";

import "../../utils/constants.sol";
import "./ERC721MysteryBoxSimple.sol";

contract ERC721MysteryBoxPausable is ERC721MysteryBoxSimple, Pausable {
  constructor(
    string memory name,
    string memory symbol,
    uint96 royalty,
    string memory baseTokenURI
  ) ERC721MysteryBoxSimple(name, symbol, royalty, baseTokenURI) {
    _grantRole(PAUSER_ROLE, _msgSender());
  }

  /**
   * @dev Triggers stopped state.
   *
   * Requirements:
   *
   * - The contract must not be paused.
   */
  function pause() public onlyRole(PAUSER_ROLE) {
    _pause();
  }

  /**
   * @dev Returns to normal state.
   *
   * Requirements:
   *
   * - The contract must be paused.
   */
  function unpause() public onlyRole(PAUSER_ROLE) {
    _unpause();
  }

  function unpack(uint256 tokenId) public override whenNotPaused {
    super.unpack(tokenId);
  }
}
