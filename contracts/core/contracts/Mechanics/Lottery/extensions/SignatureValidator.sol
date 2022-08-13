// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";
import "@openzeppelin/contracts/utils/cryptography/SignatureChecker.sol";
import "@openzeppelin/contracts/utils/Address.sol";

import "../interfaces/IERC721Ticket.sol";

contract SignatureValidator is AccessControl, Pausable, EIP712 {
  mapping(bytes32 => bool) internal _expired;

  bytes32 private constant PERMIT_SIGNATURE =
    keccak256(abi.encodePacked("EIP712(bytes32 nonce,bool[36] numbers,uint256 price)"));

  constructor(string memory name) EIP712(name, "1.0.0") {}

  function _hash(
    bytes32 nonce,
    bool[36] calldata numbers,
    uint256 price
  ) internal view returns (bytes32) {
    return
      _hashTypedDataV4(
        keccak256(abi.encode(PERMIT_SIGNATURE, nonce, keccak256(abi.encodePacked(numbers)), price))
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
