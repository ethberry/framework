// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import "@gemunion/contracts-erc1363/contracts/interfaces/IERC1363.sol";
import "@gemunion/contracts-misc/contracts/constants.sol";

import "../ERC721/interfaces/IERC721Simple.sol";
import "../ERC721/interfaces/IERC721Random.sol";
import "../ERC1155/interfaces/IERC1155Simple.sol";
import "../utils/constants.sol";
import "../utils/errors.sol";
import "./interfaces/IAsset.sol";

library ExchangeUtils {
  using Address for address;
  using SafeERC20 for IERC20;

  event PaymentEthReceived(address from, uint256 amount);
  event PaymentEthSent(address to, uint256 amount);

  /**
   * @dev transfer `Assets` from `spender` to `receiver`.
   *
   * @param price An array of assets to transfer
   * @param spender Address of spender
   * @param receiver Address of receiver
   * @param disabled Disabled TokenTypes for spend from spender
   */
  function spendFrom(
    Asset[] memory price,
    address spender,
    address receiver,
    DisabledTokenTypes memory disabled
  ) internal {
    // The total amount of native tokens in the transaction.
    uint256 totalAmount;

    // Loop through all assets
    uint256 length = price.length;
    for (uint256 i = 0; i < length; ) {
      Asset memory item = price[i];
      // If the `Asset` token is native.
      if (item.tokenType == TokenType.NATIVE && !disabled.native) {
        // increase the total amount.
        totalAmount = totalAmount + item.amount;
      }
      // If the `Asset` token is an ERC20 token.
      else if (item.tokenType == TokenType.ERC20 && !disabled.erc20) {
        if (_isERC1363Supported(receiver, item.token)) {
          // Transfer the ERC20 token and emit event to notify server
          IERC1363(item.token).transferFromAndCall(spender, receiver, item.amount);
        } else {
          // Transfer the ERC20 token in a safe way
          SafeERC20.safeTransferFrom(IERC20(item.token), spender, receiver, item.amount);
        }
      }
      // If the `Asset` token is an ERC721/ERC998 token.
      else if (
        (item.tokenType == TokenType.ERC721 && !disabled.erc721) ||
        (item.tokenType == TokenType.ERC998 && !disabled.erc998)
      ) {
        // Transfer the ERC721/ERC998 token in a safe way
        IERC721(item.token).safeTransferFrom(spender, receiver, item.tokenId);
      }
      // If the `Asset` token is an ERC1155 token.
      else if (item.tokenType == TokenType.ERC1155 && !disabled.erc1155) {
        // Transfer the ERC1155 token in a safe way
        IERC1155(item.token).safeTransferFrom(spender, receiver, item.tokenId, item.amount, "0x");
      } else {
        // should never happen
        revert UnsupportedTokenType();
      }

      unchecked {
        i++;
      }
    }

    // If there is any native token in the transaction.
    if (totalAmount > 0) {
      // Verify the total amount of native tokens matches the amount sent with the transaction.
      if (totalAmount != msg.value) {
        revert WrongAmount();
      }
      if (address(this) == receiver) {
        emit PaymentEthReceived(receiver, msg.value);
      } else {
        Address.sendValue(payable(receiver), totalAmount);
      }
    }
  }

  /**
   * @dev transfer `Assets` from `this contract` to `receiver`.
   *
   * @param price An array of assets to transfer
   * @param receiver Address of receiver
   */
  function spend(Asset[] memory price, address receiver, DisabledTokenTypes memory disabled) internal {
    // The total amount of native tokens in the transaction.
    uint256 totalAmount;
    // Loop through all assets
    uint256 length = price.length;

    for (uint256 i = 0; i < length; ) {
      Asset memory item = price[i];
      // If the `Asset` is native token.
      if (item.tokenType == TokenType.NATIVE && !disabled.native) {
        // increase the total amount.
        totalAmount = totalAmount + item.amount;
      }
      // If the `Asset` is an ERC20 token.
      else if (item.tokenType == TokenType.ERC20 && !disabled.erc20) {
        if (_isERC1363Supported(receiver, item.token)) {
          // Transfer the ERC20 token and emit event to notify server
          IERC1363(item.token).transferAndCall(receiver, item.amount);
        } else {
          // Transfer the ERC20 token in a safe way
          SafeERC20.safeTransfer(IERC20(item.token), receiver, item.amount);
        }
      }
      // If the `Asset` is an ERC721/ERC998 token.
      else if (
        (item.tokenType == TokenType.ERC721 && !disabled.erc721) ||
        (item.tokenType == TokenType.ERC998 && !disabled.erc998)
      ) {
        // Transfer the ERC721/ERC998 token in a safe way
        IERC721(item.token).safeTransferFrom(address(this), receiver, item.tokenId);
      }
      // If the `Asset` is an ERC1155 token.
      else if (item.tokenType == TokenType.ERC1155 && !disabled.erc1155) {
        // Transfer the ERC1155 token in a safe way
        IERC1155(item.token).safeTransferFrom(address(this), receiver, item.tokenId, item.amount, "0x");
      } else {
        // should never happen
        revert UnsupportedTokenType();
      }

      unchecked {
        i++;
      }
    }

    // If there is any native token in the transaction.
    if (totalAmount > 0) {
      // Send the total amount to the receiver
      Address.sendValue(payable(receiver), totalAmount);
      emit PaymentEthSent(receiver, totalAmount);
    }
  }

  /**
   * @dev Mints array of `Assets` to `receiver`.
   *
   * @param items An array of assets to mint.
   * @param receiver Address of receiver
   */
  function acquire(Asset[] memory items, address receiver, DisabledTokenTypes memory disabled) internal {
    uint256 length = items.length;

    for (uint256 i = 0; i < length; ) {
      Asset memory item = items[i];

      // If the token is an NATIVE token, transfer tokens to the receiver.
      if (item.tokenType == TokenType.NATIVE && !disabled.native) {
        ExchangeUtils.spend(_toArray(item), receiver, DisabledTokenTypes(false, false, false, false, false));
        // If the `Asset` is an ERC20 token.
      } else if (item.tokenType == TokenType.ERC20 && !disabled.erc20) {
        if (_isERC1363Supported(receiver, item.token)) {
          // Transfer the ERC20 token and emit event to notify server
          IERC1363(item.token).transferAndCall(receiver, item.amount);
        } else {
          // Transfer the ERC20 token in a safe way
          SafeERC20.safeTransfer(IERC20(item.token), receiver, item.amount);
        }
      } else if (
        (item.tokenType == TokenType.ERC721 && !disabled.erc721) ||
        (item.tokenType == TokenType.ERC998 && !disabled.erc998)
      ) {
        bool randomInterface = IERC721(item.token).supportsInterface(IERC721_RANDOM_ID);
        if (randomInterface) {
          IERC721Random(item.token).mintRandom(receiver, item.tokenId);
        } else {
          IERC721Simple(item.token).mintCommon(receiver, item.tokenId);
        }
      } else if (item.tokenType == TokenType.ERC1155 && !disabled.erc1155) {
        IERC1155Simple(item.token).mint(receiver, item.tokenId, item.amount, "0x");
      } else {
        // should never happen
        revert UnsupportedTokenType();
      }

      unchecked {
        i++;
      }
    }
  }

  /**
   * @dev Utility function that converts single item into array of items
   *
   * @param item a single Asset to be converted to array
   */
  function _toArray(Asset memory item) internal pure returns (Asset[] memory) {
    Asset[] memory items = new Asset[](1);
    items[0] = item;
    return items;
  }

  function _isERC1363Supported(address receiver, address token) internal view returns (bool) {
    return
      (receiver == address(this) ||
        (receiver.isContract() && _tryGetSupportedInterface(receiver, IERC1363_RECEIVER_ID))) &&
      _tryGetSupportedInterface(token, IERC1363_ID);
  }

  function _tryGetSupportedInterface(address account, bytes4 interfaceId) internal view returns (bool) {
    try IERC165(account).supportsInterface(interfaceId) returns (bool isSupported) {
      return isSupported;
    } catch (bytes memory) {
      return false;
    }
  }
}
