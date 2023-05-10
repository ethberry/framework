// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts v4.4.1 (interfaces/IERC1363.sol)

pragma solidity ^0.8.13;

interface IERC1363Receiver {

  /**
   * @notice Handle the receipt of ERC1363 tokens
   * @dev Any ERC1363 smart contract calls this function on the recipient
   * after a `transfer` or a `transferFrom`. This function MAY throw to revert and reject the
   * transfer. Return of other than the magic value MUST result in the
   * transaction being reverted.
   * Note: the token contract address is always the message sender.
   * @param operator address The address which called `transferAndCall` or `transferFromAndCall` function
   * @param from address The address which are token transferred from
   * @param value uint256 The amount of tokens transferred
   * @param data bytes Additional data with no specified format
   * @return `bytes4(keccak256("onTransferReceived(address,address,uint256,bytes)"))`
   *  unless throwing
   */
  function onTransferReceived(
    address operator,
    address from,
    uint256 value,
    bytes memory data
  ) external returns (bytes4);
}

interface IERC1363Spender {
  /*
   * Note: the ERC-165 identifier for this interface is 0x7b04a2d0.
   * 0x7b04a2d0 === bytes4(keccak256("onApprovalReceived(address,uint256,bytes)"))
   */

  /**
   * @notice Handle the approval of ERC1363 tokens
   * @dev Any ERC1363 smart contract calls this function on the recipient
   * after an `approve`. This function MAY throw to revert and reject the
   * approval. Return of other than the magic value MUST result in the
   * transaction being reverted.
   * Note: the token contract address is always the message sender.
   * @param owner address The address which called `approveAndCall` function
   * @param value uint256 The amount of tokens to be spent
   * @param data bytes Additional data with no specified format
   * @return `bytes4(keccak256("onApprovalReceived(address,uint256,bytes)"))`
   *  unless throwing
   */
  function onApprovalReceived(address owner, uint256 value, bytes memory data) external returns (bytes4);
}


/**
 * @dev Implementation of the {IERC1363Receiver} and {IERC1363Spender} interfaces.
 * Allows to receive ERC1363 token transfers, and receive and approve them spending on behalf of the token owner.
 */
contract ERC1363ReceiverMock is IERC1363Receiver, IERC1363Spender {
  event TransferReceived(address operator, address from, uint256 value, bytes data);
  event ApprovalReceived(address owner, uint256 value, bytes data);

  /**
   * @dev Called by a sender to notify the receiver of the transfer.
   * @param operator The address of the operator performing the transfer.
   * @param from The address of the sender.
   * @param value The amount being transferred.
   * @param data Additional data with no specified format.
   * @return bytes4 selector of onTransferReceived function
   *                unless throwing
   */
  function onTransferReceived(
    address operator,
    address from,
    uint256 value,
    bytes memory data
  ) external virtual override returns (bytes4) {
    if (data.length == 1) {
      if (data[0] == 0x00) return bytes4(0);
      if (data[0] == 0x01) revert("onTransferReceived revert");
      if (data[0] == 0x02) revert();
      if (data[0] == 0x03) assert(false);
    }
    emit TransferReceived(operator, from, value, data);
    return this.onTransferReceived.selector;
  }

  /**
   * @dev Called by a sender to notify the receiver of the approval.
   * @param owner The address of the owner providing the allowance.
   * @param value The new allowance.
   * @param data Additional data with no specified format.
   * @return bytes4 selector of onApprovalReceived function
   *                unless throwing
   */
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
