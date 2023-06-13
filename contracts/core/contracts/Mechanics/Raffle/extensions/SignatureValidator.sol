// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import "@openzeppelin/contracts/utils/cryptography/SignatureChecker.sol";
import "@openzeppelin/contracts/utils/Address.sol";

import "../../../utils/errors.sol";
import "../interfaces/IERC721RaffleTicket.sol";
import "../../../Exchange/interfaces/IAsset.sol";

contract SignatureValidator is AccessControl, Pausable, EIP712 {
  using ECDSA for bytes32;

  mapping(bytes32 => bool) private _expired;

  bytes private constant PARAMS_SIGNATURE =
    "Params(bytes32 nonce,uint256 externalId,uint256 expiresAt,address referrer,bytes32 extra)";
  bytes32 private constant PARAMS_TYPEHASH = keccak256(abi.encodePacked(PARAMS_SIGNATURE));

  bytes private constant ASSET_SIGNATURE = "Asset(uint256 tokenType,address token,uint256 tokenId,uint256 amount)";
  bytes32 private constant ASSET_TYPEHASH = keccak256(abi.encodePacked(ASSET_SIGNATURE));

  bytes32 private immutable PERMIT_SIGNATURE =
    keccak256(bytes.concat("EIP712(address account,Params params,Asset price)", ASSET_SIGNATURE, PARAMS_SIGNATURE));

  constructor(string memory name) EIP712(name, "1.0.0") {}

  function _verifySignature(
    Params memory params,
    Asset memory price,
    bytes calldata signature
  ) internal returns (address) {
    if (_expired[params.nonce]) {
      revert ExpiredSignature();
    }
    _expired[params.nonce] = true;

    if (params.expiresAt != 0) {
      if (block.timestamp > params.expiresAt) {
        revert ExpiredSignature();
      }
    }

    address account = _msgSender();

    return _recoverSigner(_hash(account, params, price), signature);
  }

  function _hash(address account, Params memory params, Asset memory price) internal view returns (bytes32) {
    return
      _hashTypedDataV4(
        keccak256(abi.encode(PERMIT_SIGNATURE, account, _hashParamsStruct(params), _hashAssetStruct(price)))
      );
  }

  function _verify(address signer, bytes32 digest, bytes memory signature) internal view returns (bool) {
    return SignatureChecker.isValidSignatureNow(signer, digest, signature);
  }

  function _recoverSigner(bytes32 digest, bytes memory signature) private pure returns (address) {
    return digest.recover(signature);
  }

  function _hashParamsStruct(Params memory params) private pure returns (bytes32) {
    return
      keccak256(
        abi.encode(PARAMS_TYPEHASH, params.nonce, params.externalId, params.expiresAt, params.referrer, params.extra)
      );
  }

  function _hashAssetStruct(Asset memory item) private pure returns (bytes32) {
    return keccak256(abi.encode(ASSET_TYPEHASH, item.tokenType, item.token, item.tokenId, item.amount));
  }
}