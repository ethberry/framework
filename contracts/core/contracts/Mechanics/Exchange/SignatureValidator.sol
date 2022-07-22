// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";
import "@openzeppelin/contracts/utils/cryptography/SignatureChecker.sol";
import "@openzeppelin/contracts/utils/Context.sol";

import "../Asset/interfaces/IAsset.sol";

contract SignatureValidator is EIP712, Context {
  using Address for address;

  mapping(bytes32 => bool) private _expired;

  bytes private constant ASSET_SIGNATURE = "Asset(uint256 tokenType,address token,uint256 tokenId,uint256 amount)";
  bytes32 private constant ASSET_TYPEHASH = keccak256(abi.encodePacked(ASSET_SIGNATURE));

  bytes32 private immutable PERMIT_SIGNATURE =
    keccak256(bytes.concat("EIP712(bytes32 nonce,address account,Asset[] items,Asset[] ingredients)", ASSET_SIGNATURE));

  constructor(string memory name) EIP712(name, "1.0.0") {}

  function _verifySignature(
    bytes32 nonce,
    Asset[] memory items,
    Asset[] memory ingredients,
    address signer,
    bytes calldata signature
  ) internal {
    require(!_expired[nonce], "Exchange: Expired signature");
    _expired[nonce] = true;

    address account = _msgSender();

    bool isVerified = _verify(signer, _hash(nonce, account, items, ingredients), signature);
    require(isVerified, "Exchange: Invalid signature");
  }

  function _verify(
    address signer,
    bytes32 digest,
    bytes memory signature
  ) private view returns (bool) {
    return SignatureChecker.isValidSignatureNow(signer, digest, signature);
  }

  function _hash(
    bytes32 nonce,
    address account,
    Asset[] memory items,
    Asset[] memory ingredients
  ) private view returns (bytes32) {
    return
      _hashTypedDataV4(
        keccak256(
          abi.encode(PERMIT_SIGNATURE, nonce, account, _hashAssetStructArray(items), _hashAssetStructArray(ingredients))
        )
      );
  }

  function _hashAssetStruct(Asset memory item) private pure returns (bytes32) {
    return keccak256(abi.encode(ASSET_TYPEHASH, item.tokenType, item.token, item.tokenId, item.amount));
  }

  function _hashAssetStructArray(Asset[] memory items) private pure returns (bytes32) {
    uint256 length = items.length;
    bytes32[] memory padded = new bytes32[](length);
    for (uint256 i = 0; i < length; i++) {
      padded[i] = _hashAssetStruct(items[i]);
    }
    return keccak256(abi.encodePacked(padded));
  }
}
