// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/security/Pausable.sol";

import "../../utils/constants.sol";
import "./ERC721MysteryboxSimple.sol";

contract ERC721MysteryboxPausable is ERC721MysteryboxSimple, Pausable {
  constructor(
    string memory name,
    string memory symbol,
    uint96 royalty,
    string memory baseTokenURI
  ) ERC721MysteryboxSimple(name, symbol, royalty, baseTokenURI) {
    _setupRole(PAUSER_ROLE, _msgSender());
  }

  function pause() public onlyRole(PAUSER_ROLE) {
    _pause();
  }

  function unpause() public onlyRole(PAUSER_ROLE) {
    _unpause();
  }
}
