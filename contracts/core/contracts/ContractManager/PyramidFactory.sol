// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "./AbstractFactory.sol";

contract PyramidFactory is AbstractFactory {
  bytes private constant PYRAMID_ARGUMENTS_SIGNATURE = "PyramidArgs(uint8[] featureIds,address[] payees,uint256[] shares)";
  bytes32 private constant PYRAMID_ARGUMENTS_TYPEHASH = keccak256(abi.encodePacked(PYRAMID_ARGUMENTS_SIGNATURE));

  bytes32 private immutable PYRAMID_PERMIT_SIGNATURE =
    keccak256(bytes.concat("EIP712(Params params,PyramidArgs args)", PARAMS_SIGNATURE, PYRAMID_ARGUMENTS_SIGNATURE));

  bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

  address[] private _pyramid_tokens;

  struct PyramidArgs {
    uint8[] featureIds;
    address[] payees;
    uint256[] shares;
  }

  // todo emit struct PyramidArgs
  event PyramidDeployed(address addr, uint8[] featureIds);

  function deployPyramid(
    Params calldata params,
    PyramidArgs calldata args,
    bytes calldata signature
  ) external onlyRole(DEFAULT_ADMIN_ROLE) returns (address addr) {
    _checkNonce(params.nonce);

    address signer = _recoverSigner(_hashPyramid(params, args), signature);
    require(hasRole(DEFAULT_ADMIN_ROLE, signer), "ContractManager: Wrong signer");

    addr = deploy2(params.bytecode, abi.encode(args.payees, args.shares), params.nonce);
    _pyramid_tokens.push(addr);

    emit PyramidDeployed(addr, args.featureIds);

    bytes32[] memory roles = new bytes32[](2);
    roles[0] = PAUSER_ROLE;
    roles[1] = DEFAULT_ADMIN_ROLE;

    fixPermissions(addr, roles);
  }

  function _hashPyramid(Params calldata params, PyramidArgs calldata args) internal view returns (bytes32) {
    return
      _hashTypedDataV4(
        keccak256(abi.encode(PYRAMID_PERMIT_SIGNATURE, _hashParamsStruct(params), _hashPyramidStruct(args)))
      );
  }

  function _hashPyramidStruct(PyramidArgs calldata p) private pure returns (bytes32) {
    return
    keccak256(
      abi.encode(
        PYRAMID_ARGUMENTS_TYPEHASH,
        keccak256(abi.encodePacked(p.featureIds)),
        keccak256(abi.encodePacked(p.payees)),
        keccak256(abi.encodePacked(p.shares))
      )
    );
  }

  function allPyramids() external view returns (address[] memory) {
    return _pyramid_tokens;
  }
}
