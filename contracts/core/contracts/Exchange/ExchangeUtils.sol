// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import "../ERC1155/interfaces/IERC1155Simple.sol";
import "../ERC721/interfaces/IERC721Simple.sol";
import "../ERC721/interfaces/IERC721Random.sol";
import "./interfaces/IAsset.sol";

contract ExchangeUtils {
  using Address for address;
  using SafeERC20 for IERC20;

  event PaymentEthReceived(address from, uint256 amount);
  event PaymentEthSent(address to, uint256 amount);

  bytes4 private constant IERC721_RANDOM = type(IERC721Random).interfaceId;

  function spend(Asset[] memory price, address account, address receiver) internal {
    uint256 length = price.length;

    // TODO calculate what is most efficient to pre-calculate here
    // TODO or calculate in next loop and validate at the end
    uint256 totalAmount;
    for (uint256 i = 0; i < length; i++) {
      Asset memory ingredient = price[i];
      if (ingredient.tokenType == TokenType.NATIVE) {
        totalAmount = totalAmount + ingredient.amount;
      }
    }

    for (uint256 i = 0; i < length; i++) {
      Asset memory ingredient = price[i];
      if (ingredient.tokenType == TokenType.NATIVE) {
        if (account == address(this)) {
          if (totalAmount > 0) {
            Address.sendValue(payable(receiver), totalAmount);
            totalAmount = 0;
            emit PaymentEthSent(receiver, totalAmount);
          }
        } else {
          require(totalAmount == msg.value, "Exchange: Wrong amount");
          emit PaymentEthReceived(receiver, msg.value);
        }
      } else if (ingredient.tokenType == TokenType.ERC20) {
        if (account == address(this)) {
          SafeERC20.safeTransfer(IERC20(ingredient.token), receiver, ingredient.amount);
        } else {
          SafeERC20.safeTransferFrom(IERC20(ingredient.token), account, receiver, ingredient.amount);
        }
      } else if (ingredient.tokenType == TokenType.ERC721 || ingredient.tokenType == TokenType.ERC998) {
        IERC721(ingredient.token).safeTransferFrom(account, receiver, ingredient.tokenId);
      } else if (ingredient.tokenType == TokenType.ERC1155) {
        IERC1155(ingredient.token).safeTransferFrom(account, receiver, ingredient.tokenId, ingredient.amount, "0x");
      } else {
        revert("Exchange: unsupported token type");
      }
    }
  }

  function acquire(Asset[] memory items, address account) internal {
    uint256 length = items.length;

    for (uint256 i = 0; i < length; i++) {
      Asset memory item = items[i];
      if (item.tokenType == TokenType.ERC721 || item.tokenType == TokenType.ERC998) {
        bool randomInterface = IERC721(item.token).supportsInterface(IERC721_RANDOM);
        if (randomInterface) {
          IERC721Random(item.token).mintRandom(account, item.tokenId);
        } else {
          IERC721Simple(item.token).mintCommon(account, item.tokenId);
        }
      } else if (item.tokenType == TokenType.ERC1155) {
        IERC1155Simple(item.token).mint(account, item.tokenId, item.amount, "0x");
      } else {
        revert("Exchange: unsupported token type");
      }
    }
  }

  function toArray(Asset memory item) public pure returns (Asset[] memory) {
    Asset[] memory items = new Asset[](1);
    items[0] = item;
    return items;
  }
}
