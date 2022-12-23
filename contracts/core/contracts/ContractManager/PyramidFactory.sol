// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "./AbstractFactory.sol";

contract PyramidFactory is AbstractFactory {
  bytes private constant PYRAMID_PARAMS =
  "Pyramid(bytes bytecode,uint8[] featureIds,bytes32 nonce)";
  bytes32 private constant PYRAMID_PARAMS_TYPEHASH = keccak256(abi.encodePacked(PYRAMID_PARAMS));

  bytes32 private immutable PYRAMID_PERMIT_SIGNATURE =
  keccak256(bytes.concat("EIP712(Pyramid p)", PYRAMID_PARAMS));

//  bytes32 private immutable PYRAMID_PERMIT_SIGNATURE =
//    keccak256("EIP712(bytes32 nonce,bytes bytecode,uint8[] featureIds)");

  bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

  address[] private _pyramid_tokens;

  struct Pyramid {
    bytes bytecode;
    uint8[] featureIds;
    bytes32 nonce;
  }

  event PyramidDeployed(address addr, uint8[] featureIds);

  function deployPyramid(
    Signature calldata sig,
    Pyramid calldata p
  ) external onlyRole(DEFAULT_ADMIN_ROLE) returns (address addr) {
    require(hasRole(DEFAULT_ADMIN_ROLE, sig.signer), "ContractManager: Wrong signer");

    bytes32 digest = _hashPyramid(p);

    _checkSignature(sig.signer, digest, sig.signature);
    _checkNonce(p.nonce);

//    addr = deploy(bytecode, abi.encode());
    addr = deploy2(p.bytecode, abi.encode(), p.nonce);
    _pyramid_tokens.push(addr);

    emit PyramidDeployed(addr, p.featureIds);

    bytes32[] memory roles = new bytes32[](2);
    roles[0] = PAUSER_ROLE;
    roles[1] = DEFAULT_ADMIN_ROLE;

    fixPermissions(addr, roles);
  }

  function _hashPyramid(Pyramid calldata p) internal view returns (bytes32) {
    return _hashTypedDataV4(keccak256(abi.encode(PYRAMID_PERMIT_SIGNATURE, _hashPyramidStruct(p))));
  }

  function _hashPyramidStruct(Pyramid calldata p) private pure returns (bytes32) {
    return
    keccak256(
      abi.encode(
        PYRAMID_PARAMS_TYPEHASH,
        keccak256(abi.encodePacked(p.bytecode)),
        keccak256(abi.encodePacked(p.featureIds)),
        p.nonce
      )
    );
  }

  function allPyramids() external view returns (address[] memory) {
    return _pyramid_tokens;
  }
}
