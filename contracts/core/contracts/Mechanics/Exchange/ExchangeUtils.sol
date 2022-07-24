// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";

import "../../ERC1155/interfaces/IERC1155Simple.sol";
import "../../ERC721/interfaces/IERC721Simple.sol";
import "../../ERC721/interfaces/IERC721Random.sol";

contract ExchangeUtils {
  bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

  bytes4 private constant IERC721_RANDOM = 0x82993c65;

  function spend(Asset[] memory ingredients, address account) internal {
    uint256 length = ingredients.length;

    // TODO calculate what is most efficient to pre-calculate here
    // TODO or calculate in next loop and validate at the end
    uint256 totalAmount;
    for (uint256 i = 0; i < length; i++) {
      Asset memory ingredient = ingredients[i];
      if (ingredient.tokenType == TokenType.NATIVE) {
        totalAmount = totalAmount + ingredient.amount;
      }
    }

    // TODO ETH and ERC20 tokens should be transferes to PaymentSplitter,
    // TODO ERC721 and ERC11155 should be burned
    // TODO PaymentSplitter address should be set by ContractManager
    address receiver = address(this);
    for (uint256 i = 0; i < length; i++) {
      Asset memory ingredient = ingredients[i];
      if (ingredient.tokenType == TokenType.NATIVE) {
        require(totalAmount == msg.value, "Exchange: Wrong amount");
      } else if (ingredient.tokenType == TokenType.ERC20) {
        IERC20(ingredient.token).transferFrom(account, receiver, ingredient.amount);
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
          IERC721Random(item.token).mintRandom(account, item);
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

  function toArray(Asset memory item) public pure returns (Asset[] memory) {
    Asset[] memory items = new Asset[](1);
    items[0] = item;
    return items;
  }
}
