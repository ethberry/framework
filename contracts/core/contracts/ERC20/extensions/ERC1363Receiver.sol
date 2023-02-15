// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts v4.4.1 (interfaces/IERC1363.sol)

pragma solidity ^0.8.13;

import "./IERC1363Receiver.sol";
import "./IERC1363Spender.sol";

contract ERC1363Receiver is IERC1363Receiver, IERC1363Spender {
  event TransferReceived(address operator, address from, uint256 value, bytes data);
  event ApprovalReceived(address owner, uint256 value, bytes data);

  function onTransferReceived(
    address operator,
    address from,
    uint256 value,
    bytes memory data
  ) external override returns (bytes4) {
    if (data.length == 1) {
      if (data[0] == 0x00) return bytes4(0);
      if (data[0] == 0x01) revert("onTransferReceived revert");
      if (data[0] == 0x02) revert();
      if (data[0] == 0x03) assert(false);
    }
    emit TransferReceived(operator, from, value, data);
    return this.onTransferReceived.selector;
  }

  function onApprovalReceived(address owner, uint256 value, bytes memory data) external override returns (bytes4) {
    if (data.length == 1) {
      if (data[0] == 0x00) return bytes4(0);
      if (data[0] == 0x01) revert("onApprovalReceived revert");
      if (data[0] == 0x02) revert();
      if (data[0] == 0x03) assert(false);
    }
    emit ApprovalReceived(owner, value, data);
    return this.onApprovalReceived.selector;
  }
}
