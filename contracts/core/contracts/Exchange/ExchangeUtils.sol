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

contract ExchangeUtils {
  using Address for address;
  using SafeERC20 for IERC20;

  event PaymentEthReceived(address from, uint256 amount);
  event PaymentEthSent(address to, uint256 amount);

  DisabledTokenTypes _disabledTypes = _disabledTypes;

  function spendFrom(
    Asset[] memory price,
    address account,
    address receiver,
    DisabledTokenTypes memory disabled
  ) internal {
    uint256 length = price.length;

    uint256 totalAmount;
    for (uint256 i = 0; i < length; ) {
      Asset memory item = price[i];
      if (item.tokenType == TokenType.NATIVE && !disabled.native) {
        totalAmount = totalAmount + item.amount;
      } else if (item.tokenType == TokenType.ERC20 && !disabled.erc20) {
        if (_isERC1363Supported(receiver, item.token)) {
          IERC1363(item.token).transferFromAndCall(account, receiver, item.amount);
        } else {
          SafeERC20.safeTransferFrom(IERC20(item.token), account, receiver, item.amount);
        }
      } else if (
        (item.tokenType == TokenType.ERC721 && !disabled.erc721) ||
        (item.tokenType == TokenType.ERC998 && !disabled.erc998)
      ) {
        IERC721(item.token).safeTransferFrom(account, receiver, item.tokenId);
      } else if (item.tokenType == TokenType.ERC1155 && !disabled.erc1155) {
        IERC1155(item.token).safeTransferFrom(account, receiver, item.tokenId, item.amount, "0x");
      } else {
        // should never happen
        revert UnsupportedTokenType();
      }

      unchecked {
        i++;
      }
    }

    if (totalAmount > 0) {
      require(totalAmount == msg.value, "Exchange: Wrong amount");
      if (address(this) == receiver) {
        emit PaymentEthReceived(receiver, msg.value);
      } else {
        Address.sendValue(payable(receiver), totalAmount);
      }
    }
  }

  function spend(Asset[] memory price, address receiver) internal {
    uint256 length = price.length;

    uint256 totalAmount;
    for (uint256 i = 0; i < length; ) {
      Asset memory item = price[i];
      if (item.tokenType == TokenType.NATIVE) {
        totalAmount = totalAmount + item.amount;
      } else if (item.tokenType == TokenType.ERC20) {
        if (_isERC1363Supported(receiver, item.token)) {
          IERC1363(item.token).transferAndCall(receiver, item.amount);
        } else {
          SafeERC20.safeTransfer(IERC20(item.token), receiver, item.amount);
        }
      } else if (item.tokenType == TokenType.ERC721 || item.tokenType == TokenType.ERC998) {
        IERC721(item.token).safeTransferFrom(address(this), receiver, item.tokenId);
      } else if (item.tokenType == TokenType.ERC1155) {
        IERC1155(item.token).safeTransferFrom(address(this), receiver, item.tokenId, item.amount, "0x");
      } else {
        // should never happen
        revert UnsupportedTokenType();
      }

      unchecked {
        i++;
      }
    }

    if (totalAmount > 0) {
      Address.sendValue(payable(receiver), totalAmount);
      emit PaymentEthSent(receiver, totalAmount);
    }
  }

  function acquire(Asset[] memory items, address account) internal {
    uint256 length = items.length;

    for (uint256 i = 0; i < length; ) {
      Asset memory item = items[i];

      // If the token is an NATIVE or ERC20 - transfer to receiver, otherwise - mint
      if (item.tokenType == TokenType.NATIVE) {
        spend(_toArray(item), account);
      } else if (item.tokenType == TokenType.ERC20) {
        spend(_toArray(item), account);
      } else if (item.tokenType == TokenType.ERC721 || item.tokenType == TokenType.ERC998) {
        bool randomInterface = IERC721(item.token).supportsInterface(IERC721_RANDOM_ID);
        if (randomInterface) {
          IERC721Random(item.token).mintRandom(account, item.tokenId);
        } else {
          IERC721Simple(item.token).mintCommon(account, item.tokenId);
        }
      } else if (item.tokenType == TokenType.ERC1155) {
        IERC1155Simple(item.token).mint(account, item.tokenId, item.amount, "0x");
      } else {
        // should never happen
        revert UnsupportedTokenType();
      }

      unchecked {
        i++;
      }
    }
  }

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
