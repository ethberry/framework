// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";
import "@openzeppelin/contracts/utils/cryptography/SignatureChecker.sol";
import "@openzeppelin/contracts/utils/Context.sol";

import "../Asset/Asset.sol";
import "../Asset/interfaces/IAsset.sol";

contract SignatureValidator is AssetHelper, EIP712, Context {
  using Address for address;

  mapping(bytes32 => bool) private _expired;

  bytes32 internal immutable PERMIT_SIGNATURE =
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
}
