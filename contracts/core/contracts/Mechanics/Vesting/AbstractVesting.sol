// SPDX-License-Identifier: MIT

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/finance/VestingWallet.sol";
import "@openzeppelin/contracts/governance/utils/IVotes.sol";
import "@openzeppelin/contracts/utils/Multicall.sol";
import "@gemunion/contracts-erc20/contracts/extensions/ERC1363Receiver.sol";
import "../../Exchange/ExchangeUtils.sol";

contract AbstractVesting is VestingWallet, Ownable, Multicall, ExchangeUtils, ERC1363Receiver {
  constructor(
    address beneficiaryAddress,
    uint64 startTimestamp,
    uint64 durationSeconds
  ) VestingWallet(address(1), startTimestamp, durationSeconds) {
    _transferOwnership(beneficiaryAddress);
  }

  function topUp(Asset[] memory price) external payable {
    spendFrom(price, _msgSender(), address(this));
  }

  receive() external payable override {
    revert();
  }

  // Vesting beneficiary
  function beneficiary() public view virtual override returns (address) {
    return owner();
  }

  function releaseable() public view virtual returns (uint256) {
    return vestedAmount(uint64(block.timestamp)) - released();
  }

  function releaseable(address token) public view virtual returns (uint256) {
    return vestedAmount(token, uint64(block.timestamp)) - released(token);
  }

  // Allow delegation of votes
  function delegate(IVotes token, address delegatee) public virtual onlyOwner {
    token.delegate(delegatee);
  }
}
