// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

import "../../ERC721/interfaces/IERC721Random.sol";

contract ClaimProxy is IERC721Random, AccessControl, Pausable {
  using Address for address;

  bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
  bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

  IERC721Random _factory;

  constructor() {
    _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
    _setupRole(MINTER_ROLE, _msgSender());
    _setupRole(PAUSER_ROLE, _msgSender());

    // TODO setup MINTER_ROLE for Lootbox
  }

  function setFactory(address factory) external onlyRole(DEFAULT_ADMIN_ROLE) {
    require(factory.isContract(), "Claim: the factory must be a deployed contract");
    _factory = IERC721Random(factory);
  }

  function mintRandom(address to, uint256 templateId) external whenNotPaused onlyRole(MINTER_ROLE) {
    _factory.mintRandom(to, templateId);
  }

  function mintCommon(address to, uint256 templateId) external whenNotPaused onlyRole(MINTER_ROLE) {
    _factory.mintRandom(to, templateId);
  }

  function upgrade(uint256) public pure returns (bool) {
    return false;
  }

  function pause() public onlyRole(PAUSER_ROLE) {
    _pause();
  }

  function unpause() public onlyRole(PAUSER_ROLE) {
    _unpause();
  }

  receive() external payable {
    revert();
  }

  function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
    return interfaceId == type(IERC721Random).interfaceId || super.supportsInterface(interfaceId);
  }
}
