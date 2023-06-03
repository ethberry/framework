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

import "../interfaces/IERC721Lottery.sol";
import "../../../Exchange/interfaces/IAsset.sol";

contract SignatureValidator is AccessControl, Pausable, EIP712 {
  mapping(bytes32 => bool) private _expired;

  bytes private constant PARAMS_SIGNATURE =
    "Params(bytes32 nonce,uint256 externalId,uint256 expiresAt,address referrer)";
  bytes32 private constant PARAMS_TYPEHASH = keccak256(abi.encodePacked(PARAMS_SIGNATURE));

  bytes32 private immutable PERMIT_SIGNATURE =
    keccak256(bytes.concat("EIP712(address account,Params params,bool[36] numbers,uint256 price)", PARAMS_SIGNATURE));

  constructor(string memory name) EIP712(name, "1.0.0") {}

  function _verifySignature(
    Params memory params,
    bool[36] calldata numbers,
    uint256 price,
    address signer,
    bytes calldata signature
  ) internal {
    require(!_expired[params.nonce], "Lottery: Expired signature");
    _expired[params.nonce] = true;

    if (params.expiresAt != 0) {
      require(block.timestamp <= params.expiresAt, "Lottery: Expired signature");
    }

    bool isVerified = _verify(signer, _hash(_msgSender(), params, numbers, price), signature);
    require(isVerified, "Lottery: Invalid signature");
  }

  function _hash(
    address account,
    Params memory params,
    bool[36] calldata numbers,
    uint256 price
  ) internal view returns (bytes32) {
    return
      _hashTypedDataV4(
        keccak256(
          abi.encode(PERMIT_SIGNATURE, account, _hashParamsStruct(params), keccak256(abi.encodePacked(numbers)), price)
        )
      );
  }

  function _verify(address signer, bytes32 digest, bytes memory signature) internal view returns (bool) {
    return SignatureChecker.isValidSignatureNow(signer, digest, signature);
  }

  function _hashParamsStruct(Params memory params) private pure returns (bytes32) {
    return keccak256(abi.encode(PARAMS_TYPEHASH, params.nonce, params.externalId, params.expiresAt, params.referrer));
  }
}
