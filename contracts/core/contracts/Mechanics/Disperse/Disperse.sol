// SPDX-License-Identifier: UNLICENSED

/**
 *Submitted for verification at BscScan.com on 2020-09-14
 */

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/utils/Address.sol";

import "../../Exchange/ExchangeUtils.sol";
import "./interfaces/IDisperse.sol";

/**
 * @title Disperse Contract
 * @dev A contract for dispersing ether, ERC20 tokens, ERC721 tokens, and ERC1155 tokens to multiple recipients.
 */
contract Disperse is IDisperse, ERC165, Context {
  function disperse(Asset[] memory items, address[] calldata receivers) external payable override {
    if (items.length != receivers.length) {
      revert WrongArrayLength();
    }

    uint256 length = receivers.length;
    for (uint256 i = 0; i < length; ) {
      ExchangeUtils.spendFrom(
        ExchangeUtils._toArray(items[i]),
        _msgSender(),
        receivers[i],
        DisabledTokenTypes(false, false, false, false, false)
      );
      unchecked {
        i++;
      }
    }
  }

  receive() external payable {
    revert();
  }

  function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
    return interfaceId == type(IDisperse).interfaceId || super.supportsInterface(interfaceId);
  }
}
