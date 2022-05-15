// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";
import "@openzeppelin/contracts/utils/cryptography/SignatureChecker.sol";

import "../ERC721/interfaces/IERC721Simple.sol";
import "../ERC721/interfaces/IERC721Random.sol";
import "../ERC721/interfaces/IERC721Dropbox.sol";

contract ERC721Marketplace is AccessControl, Pausable, EIP712 {
  using Address for address;

  mapping(bytes32 => bool) private _expired;
  bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
  bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

  bytes32 private immutable PERMIT_SIGNATURE =
    keccak256("EIP712(bytes32 nonce,address collection,uint256 templateId,uint256 price)");

  event Redeem(address from, address collection, uint256 tokenId, uint256 templateId, uint256 price);
  event RedeemDropbox(address from, address collection, uint256 tokenId, uint256 templateId, uint256 price);

  constructor(string memory name) EIP712(name, "1.0.0") {
    _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
    _setupRole(MINTER_ROLE, _msgSender());
    _setupRole(PAUSER_ROLE, _msgSender());
  }

  function buyCommon(
    bytes32 nonce,
    address collection,
    uint256 templateId,
    address signer,
    bytes calldata signature
  ) public payable whenNotPaused {
    require(hasRole(MINTER_ROLE, signer), "ERC721Marketplace: Wrong signer");

    require(!_expired[nonce], "ERC721Marketplace: Expired signature");
    _expired[nonce] = true;

    bool isVerified = _verify(signer, _hash(nonce, collection, templateId, msg.value), signature);
    require(isVerified, "ERC721Marketplace: Invalid signature");

    uint256 tokenId = IERC721Simple(collection).mintCommon(_msgSender(), templateId);
    emit Redeem(_msgSender(), collection, tokenId, templateId, msg.value);
  }

  function buyDropbox(
    bytes32 nonce,
    address collection,
    uint256 templateId,
    address signer,
    bytes calldata signature
  ) public payable whenNotPaused {
    require(hasRole(MINTER_ROLE, signer), "ERC721Marketplace: Wrong signer");

    require(!_expired[nonce], "ERC721Marketplace: Expired signature");
    _expired[nonce] = true;

    bool isVerified = _verify(signer, _hash(nonce, collection, templateId, msg.value), signature);
    require(isVerified, "ERC721Marketplace: Invalid signature");

    uint256 tokenId = IERC721Dropbox(collection).mintDropbox(_msgSender(), templateId);
    emit RedeemDropbox(_msgSender(), collection, tokenId, templateId, msg.value);
  }

  function _hash(
    bytes32 nonce,
    address collection,
    uint256 templateId,
    uint256 price
  ) internal view returns (bytes32) {
    return _hashTypedDataV4(keccak256(abi.encode(PERMIT_SIGNATURE, nonce, collection, templateId, price)));
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
}
