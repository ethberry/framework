// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";
import "@openzeppelin/contracts/utils/cryptography/SignatureChecker.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";

import "../Asset/Asset.sol";
import "../Asset/interfaces/IAsset.sol";
import "../Lootbox/interfaces/ILootbox.sol";
import "../../ERC1155/interfaces/IERC1155Simple.sol";
import "../../ERC721/interfaces/IERC721Simple.sol";
import "../../ERC721/interfaces/IERC721Random.sol";

contract Exchange is AssetHelper, AccessControl, Pausable, EIP712, ERC1155Holder {
  using Address for address;

  mapping(bytes32 => bool) private _expired;

  bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
  bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

  bytes4 private constant IERC721_RANDOM = 0x0301b0bf;
  bytes4 private constant IERC721_LOOTBOX = 0xe7728dc6;

  bytes32 internal immutable PERMIT_SIGNATURE =
    keccak256(bytes.concat("EIP712(bytes32 nonce,address account,Asset[] items,Asset[] ingredients)", ASSET_SIGNATURE));

  event Transaction(address from, Asset[] items, Asset[] ingredients);

  constructor(string memory name) EIP712(name, "1.0.0") {
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

    require(!_expired[nonce], "Exchange: Expired signature");
    _expired[nonce] = true;

    address account = _msgSender();

    bool isVerified = _verify(signer, _hash(nonce, account, items, ingredients), signature);
    require(isVerified, "Exchange: Invalid signature");

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
          IERC721Random(item.token).mintRandom(account, item.tokenId, 0);
        } else if (lootboxInterface) {
          ILootbox(item.token).mintLootbox(account, item.tokenId);
        } else {
          IERC721Simple(item.token).mintCommon(account, item.tokenId);
        }
      } else if (item.tokenType == TokenType.ERC1155) {
        IERC1155Simple(item.token).mint(account, item.tokenId, item.amount, "0x");
      } else {
        revert("Exchange: unsupported token type");
      }
    }
    emit Transaction(account, items, ingredients);
  }

  function _hash(
    bytes32 nonce,
    address account,
    Asset[] memory items,
    Asset[] memory ingredients
  ) internal view returns (bytes32) {
    return
      _hashTypedDataV4(
        keccak256(
          abi.encode(PERMIT_SIGNATURE, nonce, account, hashAssetStructArray(items), hashAssetStructArray(ingredients))
        )
      );
  }

  function _verify(
    address signer,
    bytes32 digest,
    bytes memory signature
  ) internal view returns (bool) {
    return SignatureChecker.isValidSignatureNow(signer, digest, signature);
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
