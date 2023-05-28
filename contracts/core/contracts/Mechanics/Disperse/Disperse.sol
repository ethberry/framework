/**
 *Submitted for verification at BscScan.com on 2020-09-14
 */

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";

// TODO implement context
contract Disperse {
  function disperseEther(address[] calldata recipients, uint256[] calldata amounts) external payable {
    // TODO require recipients.length === values.length
    for (uint256 i = 0; i < recipients.length; i++) {
      // TODO replace with Address.sendValue
      payable(recipients[i]).transfer(amounts[i]);
    }
    // TODO why do we need this?
    uint256 balance = address(this).balance;
    if (balance > 0) {
      // TODO replace with Address.sendValue
      payable(msg.sender).transfer(balance);
    }
  }

  function disperseERC20(IERC20 token, address[] calldata recipients, uint256[] calldata amounts) external {
    // TODO require recipients.length === values.length
    for (uint256 i = 0; i < recipients.length; i++) {
      // TODO wrap with try/catch, throw custom error
      require(token.transferFrom(msg.sender, recipients[i], amounts[i]));
    }
    // TODO calculate gas
    //    uint256 total = 0;
    //    for (uint256 i = 0; i < recipients.length; i++) {
    //      total += values[i];
    //    }
    //    require(token.transferFrom(msg.sender, address(this), total));
    //    for (uint256 i = 0; i < recipients.length; i++) {
    //      require(token.transfer(recipients[i], values[i]));
    //    }
  }

  function disperseERC721(IERC721 token, address[] calldata recipients, uint256[] calldata tokenIds) external {
    // TODO require recipients.length === values.length
    for (uint256 i = 0; i < recipients.length; i++) {
      // TODO wrap with try/catch, throw custom error
      token.safeTransferFrom(msg.sender, recipients[i], tokenIds[i]);
    }
  }

  function disperseERC1155(
    IERC1155 token,
    address[] calldata recipients,
    uint256[] calldata tokenIds,
    uint256[] calldata amounts
  ) external {
    // TODO require recipients.length === values.length
    for (uint256 i = 0; i < recipients.length; i++) {
      // TODO wrap with try/catch, throw custom error
      token.safeTransferFrom(msg.sender, recipients[i], tokenIds[i], amounts[i], "0x");
    }
  }
}
