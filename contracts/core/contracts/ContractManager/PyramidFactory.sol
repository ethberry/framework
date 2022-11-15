// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "./AbstractFactory.sol";

contract PyramidFactory is AbstractFactory {
  bytes32 private immutable PYRAMID_PERMIT_SIGNATURE =
    keccak256("EIP712(bytes32 nonce,bytes bytecode,uint8[] featureIds)");

  bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

  address[] private _pyramid_tokens;

  event PyramidDeployed(address addr, uint8[] featureIds);

  function deployPyramid(
    bytes32 nonce,
    bytes calldata bytecode,
    uint8[] calldata featureIds,
    address signer,
    bytes calldata signature
  ) external onlyRole(DEFAULT_ADMIN_ROLE) returns (address addr) {
    require(hasRole(DEFAULT_ADMIN_ROLE, signer), "ContractManager: Wrong signer");

    bytes32 digest = _hashPyramid(nonce, bytecode, featureIds);

    _checkSignature(signer, digest, signature);
    _checkNonce(nonce);

    addr = deploy(bytecode, abi.encode());
    _pyramid_tokens.push(addr);

    emit PyramidDeployed(addr, featureIds);

    bytes32[] memory roles = new bytes32[](2);
    roles[0] = PAUSER_ROLE;
    roles[1] = DEFAULT_ADMIN_ROLE;

    fixPermissions(addr, roles);
  }

  function _hashPyramid(bytes32 nonce, bytes calldata bytecode, uint8[] calldata featureIds)
    internal
    view
    returns (bytes32)
  {
    return
      _hashTypedDataV4(
        keccak256(
          abi.encode(
            PYRAMID_PERMIT_SIGNATURE,
            nonce,
            keccak256(abi.encodePacked(bytecode)),
            keccak256(abi.encodePacked(featureIds))
          )
        )
      );
  }

  function allPyramids() external view returns (address[] memory) {
    return _pyramid_tokens;
  }
}
