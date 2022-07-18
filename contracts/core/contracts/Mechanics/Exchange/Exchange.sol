// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";

import "./SignatureValidator.sol";
import "../Asset/interfaces/IAsset.sol";
import "../Lootbox/interfaces/ILootbox.sol";
import "../../ERC1155/interfaces/IERC1155Simple.sol";
import "../../ERC721/interfaces/IERC721Simple.sol";
import "../../ERC721/interfaces/IERC721Random.sol";

contract Exchange is SignatureValidator, AccessControl, Pausable, ERC1155Holder {
  using Address for address;

  bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
  bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

  bytes4 private constant IERC721_RANDOM = 0x82993c65;
  bytes4 private constant IERC721_LOOTBOX = 0x503c3942;

  event Transaction(address from, Asset[] items, Asset[] ingredients);

  constructor(string memory name) SignatureValidator(name) {
    _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
    _setupRole(MINTER_ROLE, _msgSender());
    _setupRole(PAUSER_ROLE, _msgSender());
  }

  function execute(
    bytes32 nonce,
    Asset[] memory items,
    Asset[] memory ingredients,
    address signer,
    bytes calldata signature
  ) external payable whenNotPaused {
    require(hasRole(MINTER_ROLE, signer), "Exchange: Wrong signer");
    _verifySignature(nonce, items, ingredients, signer, signature);

    address account = _msgSender();

    uint256 length1 = ingredients.length;

    // TODO calculate what is most efficient
    uint256 totalAmount;
    for (uint256 i = 0; i < length1; i++) {
      Asset memory ingredient = ingredients[i];
      if (ingredient.tokenType == TokenType.NATIVE) {
        totalAmount = totalAmount + ingredient.amount;
      }
    }

    for (uint256 i = 0; i < length1; i++) {
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

    uint256 length2 = items.length;

    for (uint256 i = 0; i < length2; i++) {
      Asset memory item = items[i];
      if (item.tokenType == TokenType.ERC721 || item.tokenType == TokenType.ERC998) {
        bool randomInterface = IERC721(item.token).supportsInterface(IERC721_RANDOM);
        bool lootboxInterface = IERC721(item.token).supportsInterface(IERC721_LOOTBOX);
        if (randomInterface) {
          IERC721Random(item.token).mintRandom(account, item);
        } else if (lootboxInterface) {
          ILootbox(item.token).mintLootbox(account, item);
        } else {
          IERC721Simple(item.token).mintCommon(account, item);
        }
      } else if (item.tokenType == TokenType.ERC1155) {
        IERC1155Simple(item.token).mint(account, item.tokenId, item.amount, "0x");
      } else {
        revert("Exchange: unsupported token type");
      }
    }
    emit Transaction(account, items, ingredients);
  }

  function upgrade(
    bytes32 nonce,
    Asset[] memory items,
    Asset[] memory ingredients,
    address signer,
    bytes calldata signature
  ) external payable {
    require(hasRole(MINTER_ROLE, signer), "Exchange: Wrong signer");
    _verifySignature(nonce, items, ingredients, signer, signature);

    require(items.length != 0, "Exchange: No item");

    address account = _msgSender();

    uint256 length1 = ingredients.length;

    // TODO calculate what is most efficient
    uint256 totalAmount;
    for (uint256 i = 0; i < length1; i++) {
      Asset memory ingredient = ingredients[i];
      if (ingredient.tokenType == TokenType.NATIVE) {
        totalAmount = totalAmount + ingredient.amount;
      }
    }

    for (uint256 i = 0; i < length1; i++) {
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

    Asset memory item = items[0];

    IERC721Graded(item.token).upgrade(item.tokenId);
  }

  function pause() public virtual onlyRole(PAUSER_ROLE) {
    _pause();
  }

  function unpause() public virtual onlyRole(PAUSER_ROLE) {
    _unpause();
  }

  function supportsInterface(bytes4 interfaceId)
    public
    view
    virtual
    override(AccessControl, ERC1155Receiver)
    returns (bool)
  {
    return super.supportsInterface(interfaceId);
  }
}
