// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";
import "@openzeppelin/contracts/utils/cryptography/SignatureChecker.sol";

import "../ERC1155/interfaces/IERC1155Simple.sol";

contract ERC1155Marketplace is AccessControl, Pausable, EIP712 {
  using Address for address;

  mapping(bytes32 => bool) private _expired;
  bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
  bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

  bytes32 private immutable PERMIT_SIGNATURE = keccak256("EIP712(bytes32 nonce,address collection,uint256[] tokenIds,uint256[] amounts,uint256 price)");

  event Redeem(address from, address collection, uint256[] tokenIds, uint256[] amounts, uint256 price);

  constructor(string memory name) EIP712(name, "1.0.0") {
    _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
    _setupRole(MINTER_ROLE, _msgSender());
    _setupRole(PAUSER_ROLE, _msgSender());
  }

  function buyResources(
    bytes32 nonce,
    address collection,
    uint256[] memory tokenIds,
    uint256[] memory amounts,
    address signer,
    bytes calldata signature
  ) public payable whenNotPaused {
    require(hasRole(MINTER_ROLE, signer), "ERC1155Marketplace: Wrong signer");

    require(!_expired[nonce], "ERC1155Marketplace: Expired signature");
    _expired[nonce] = true;

    require(tokenIds.length == amounts.length, "ERC1155Marketplace: tokenIds and amounts length mismatch");

    bool isVerified = _verify(signer, _hash(nonce, collection, tokenIds, amounts, msg.value), signature);
    require(isVerified, "ERC1155Marketplace: Invalid signature");

    IERC1155Simple(collection).mintBatch(_msgSender(), tokenIds, amounts, "0x");
    emit Redeem(_msgSender(), collection, tokenIds, amounts, msg.value);
  }

  function _hash(
    bytes32 nonce,
    address collection,
    uint256[] memory tokenIds,
    uint256[] memory amounts,
    uint256 price
  ) internal view returns (bytes32) {
    return
      _hashTypedDataV4(
        keccak256(
          abi.encode(
            PERMIT_SIGNATURE,
            nonce,
            collection,
            keccak256(abi.encodePacked(tokenIds)),
            keccak256(abi.encodePacked(amounts)),
            price
          )
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

  receive() external payable {
    revert();
  }
}
