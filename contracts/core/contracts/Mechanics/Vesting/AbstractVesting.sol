// SPDX-License-Identifier: MIT

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/finance/VestingWallet.sol";
import "@openzeppelin/contracts/governance/utils/IVotes.sol";
import "@openzeppelin/contracts/utils/Multicall.sol";
import "@openzeppelin/contracts/utils/math/SafeCast.sol";

import "../../utils/TopUp.sol";

contract AbstractVesting is VestingWallet, Ownable, Multicall, TopUp {
  using SafeCast for uint256;

  constructor(
    address beneficiaryAddress,
    uint64 startTimestamp,
    uint64 durationSeconds
  ) VestingWallet(address(1), startTimestamp, durationSeconds) {
    _transferOwnership(beneficiaryAddress);
  }

  /**
   * @dev Allows to top-up the vesting contract with tokens (NATIVE and ERC20 only)
   * @param price An array of Asset representing the tokens to be transferred.
   */
  function topUp(Asset[] memory price) external payable override {
    super.spendFrom(price, _msgSender(), address(this), DisabledTokenTypes(false, false, true, true, true));
  }

  /**
   * @dev Restrict the contract to receive Ether (receive via topUp function only).
   */
  receive() external payable override(VestingWallet, TopUp) {
    revert();
  }

  // Vesting beneficiary
  function beneficiary() public view virtual override returns (address) {
    return owner();
  }

  function releaseable() public view virtual returns (uint256) {
    return vestedAmount(block.timestamp.toUint64()) - released();
  }

  function releaseable(address token) public view virtual returns (uint256) {
    return vestedAmount(token, block.timestamp.toUint64()) - released(token);
  }

  // Allow delegation of votes
  function delegate(IVotes token, address delegatee) public virtual onlyOwner {
    token.delegate(delegatee);
  }

  function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
    return super.supportsInterface(interfaceId);
  }
}
