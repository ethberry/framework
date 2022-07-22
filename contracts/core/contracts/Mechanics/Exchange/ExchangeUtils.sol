// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";

import "../Asset/interfaces/IAsset.sol";

import "../Lootbox/interfaces/IERC721Lootbox.sol";
import "../../ERC1155/interfaces/IERC1155Simple.sol";
import "../../ERC721/interfaces/IERC721Simple.sol";
import "../../ERC721/interfaces/IERC721Random.sol";

contract ExchangeUtils is Context {
  bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

  bytes4 private constant IERC721_RANDOM = 0x82993c65;
  bytes4 private constant IERC721_LOOTBOX = 0x503c3942;

  function spend(Asset[] memory ingredients) internal {
    address account = _msgSender();

    uint256 length = ingredients.length;

    // TODO calculate what is most efficient
    uint256 totalAmount;
    for (uint256 i = 0; i < length; i++) {
      Asset memory ingredient = ingredients[i];
      if (ingredient.tokenType == TokenType.NATIVE) {
        totalAmount = totalAmount + ingredient.amount;
      }
    }

    for (uint256 i = 0; i < length; i++) {
      Asset memory ingredient = ingredients[i];
      if (ingredient.tokenType == TokenType.NATIVE) {
        require(totalAmount == msg.value, "Exchange: Wrong amount");
      } else if (ingredient.tokenType == TokenType.ERC20) {
        IERC20(ingredient.token).transferFrom(account, address(this), ingredient.amount);
      } else if (ingredient.tokenType == TokenType.ERC1155) {
        IERC1155(ingredient.token).safeTransferFrom(
          account,
          address(this),
          ingredient.tokenId,
          ingredient.amount,
          "0x"
        );
      } else {
        revert("Exchange: unsupported token type");
      }
    }
  }

  function acquire(Asset[] memory items) internal {
    address account = _msgSender();

    uint256 length = items.length;

    for (uint256 i = 0; i < length; i++) {
      Asset memory item = items[i];
      if (item.tokenType == TokenType.ERC721 || item.tokenType == TokenType.ERC998) {
        bool randomInterface = IERC721(item.token).supportsInterface(IERC721_RANDOM);
        bool lootboxInterface = IERC721(item.token).supportsInterface(IERC721_LOOTBOX);
        if (randomInterface) {
          IERC721Random(item.token).mintRandom(account, item);
        } else if (lootboxInterface) {
          IERC721Lootbox(item.token).mintLootbox(account, item);
        } else {
          IERC721Simple(item.token).mintCommon(account, item);
        }
      } else if (item.tokenType == TokenType.ERC1155) {
        IERC1155Simple(item.token).mint(account, item.tokenId, item.amount, "0x");
      } else {
        revert("Exchange: unsupported token type");
      }
    }
  }
}
