// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";

import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";
import "@openzeppelin/contracts/utils/cryptography/SignatureChecker.sol";

import "../Asset/Asset.sol";
import "../Asset/interfaces/IAsset.sol";
import "../Dropbox/interfaces/IDropbox.sol";
import "../../ERC721/interfaces/IERC721Simple.sol";
import "../../ERC721/interfaces/IERC721Random.sol";
import "../../ERC1155/interfaces/IERC1155Simple.sol";

contract Marketplace is AssetHelper, AccessControl, Pausable, EIP712, ERC1155Holder {
  using Address for address;

  mapping(bytes32 => bool) private _expired;
  bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
  bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

  bytes32 internal immutable PERMIT_SIGNATURE =
    keccak256(bytes.concat("EIP712(bytes32 nonce,Asset item,Asset price)", ASSET_SIGNATURE));

  event RedeemCommon(address from, Asset item, Asset price);
  event RedeemDropbox(address from, Asset item, Asset price);

  constructor(string memory name) EIP712(name, "1.0.0") {
    _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
    _setupRole(MINTER_ROLE, _msgSender());
    _setupRole(PAUSER_ROLE, _msgSender());
  }

  function purchaseCommon(
    bytes32 nonce,
    Asset calldata item,
    Asset calldata price,
    address signer,
    bytes calldata signature
  ) public payable whenNotPaused {
    require(hasRole(MINTER_ROLE, signer), "Marketplace: Wrong signer");

    require(!_expired[nonce], "Marketplace: Expired signature");
    _expired[nonce] = true;

    bool isVerified = _verify(signer, _hash(nonce, item, price), signature);
    require(isVerified, "Marketplace: Invalid signature");

    if (price.tokenType == TokenType.NATIVE) {
      require(price.amount == msg.value, "Marketplace: Wrong amount");
    } else if (price.tokenType == TokenType.ERC20) {
      IERC20(price.token).transferFrom(_msgSender(), address(this), price.amount);
    } else if (price.tokenType == TokenType.ERC1155) {
      IERC1155(price.token).safeTransferFrom(_msgSender(), address(this), price.tokenId, price.amount, "0x");
    } else {
      revert("Marketplace: unsupported token type");
    }

    uint256 tokenId;
    if (item.tokenType == TokenType.ERC721 || item.tokenType == TokenType.ERC998) {
      tokenId = IERC721Simple(item.token).mintCommon(_msgSender(), item.tokenId);
    } else if (item.tokenType == TokenType.ERC1155) {
      IERC1155Simple(item.token).mint(_msgSender(), item.tokenId, item.amount, "0x");
      tokenId = item.tokenId;
    } else {
      revert("Marketplace: unsupported token type");
    }

    emit RedeemCommon(_msgSender(), item, price);
  }

  function purchaseDropbox(
    bytes32 nonce,
    Asset calldata item,
    Asset calldata price,
    address signer,
    bytes calldata signature
  ) public payable whenNotPaused {
    require(hasRole(MINTER_ROLE, signer), "Marketplace: Wrong signer");

    require(!_expired[nonce], "Marketplace: Expired signature");
    _expired[nonce] = true;

    bool isVerified = _verify(signer, _hash(nonce, item, price), signature);
    require(isVerified, "Marketplace: Invalid signature");

    if (price.tokenType == TokenType.NATIVE) {
      require(price.amount == msg.value, "Marketplace: Wrong amount");
    } else if (price.tokenType == TokenType.ERC20) {
      IERC20(price.token).transferFrom(_msgSender(), address(this), price.amount);
    } else if (price.tokenType == TokenType.ERC1155) {
      IERC1155(price.token).safeTransferFrom(_msgSender(), address(this), price.tokenId, price.amount, "0x");
    } else {
      revert("Marketplace: unsupported token type");
    }

    uint256 tokenId;
    if (item.tokenType == TokenType.ERC721 || item.tokenType == TokenType.ERC998) {
      tokenId = IDropbox(item.token).mintDropbox(_msgSender(), item.tokenId);
    } else {
      revert("Marketplace: unsupported token type");
    }

    emit RedeemDropbox(_msgSender(), item, price);
  }

  function _hash(
    bytes32 nonce,
    Asset memory item,
    Asset memory price
  ) internal view returns (bytes32) {
    return
      _hashTypedDataV4(keccak256(abi.encode(PERMIT_SIGNATURE, nonce, hashAssetStruct(item), hashAssetStruct(price))));
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

  receive() external payable {
    revert();
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
