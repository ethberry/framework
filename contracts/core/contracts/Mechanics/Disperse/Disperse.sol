/**
 *Submitted for verification at BscScan.com on 2020-09-14
 */

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// TODO implement context
contract Disperse {
  function disperseEther(address[] calldata recipients, uint256[] calldata values) external payable {
    // TODO require recipients.length === values.length
    for (uint256 i = 0; i < recipients.length; i++) {
      // TODO replace with Address.sendValue
      payable(recipients[i]).transfer(values[i]);
    }
    // TODO why do we need this?
    uint256 balance = address(this).balance;
    if (balance > 0) {
      // TODO replace with Address.sendValue
      payable(msg.sender).transfer(balance);
    }
  }

  function disperseToken(IERC20 token, address[] calldata recipients, uint256[] calldata values) external {
    // TODO require recipients.length === values.length
    uint256 total = 0;
    for (uint256 i = 0; i < recipients.length; i++) {
      total += values[i];
    }
    require(token.transferFrom(msg.sender, address(this), total));
    for (uint256 i = 0; i < recipients.length; i++) {
      require(token.transfer(recipients[i], values[i]));
    }
  }

  function disperseTokenSimple(IERC20 token, address[] calldata recipients, uint256[] calldata values) external {
    for (uint256 i = 0; i < recipients.length; i++) {
      require(token.transferFrom(msg.sender, recipients[i], values[i]));
    }
  }
}
