// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "../utils/errors.sol";
import "./AbstractFactory.sol";

contract PyramidFactory is AbstractFactory {
  bytes private constant PYRAMID_ARGUMENTS_SIGNATURE =
    "PyramidArgs(address[] payees,uint256[] shares,string contractTemplate)";
  bytes32 private constant PYRAMID_ARGUMENTS_TYPEHASH = keccak256(PYRAMID_ARGUMENTS_SIGNATURE);

  bytes32 private immutable PYRAMID_PERMIT_SIGNATURE =
    keccak256(bytes.concat("EIP712(Params params,PyramidArgs args)", PARAMS_SIGNATURE, PYRAMID_ARGUMENTS_SIGNATURE));

  address[] private _pyramid_tokens;

  struct PyramidArgs {
    address[] payees;
    uint256[] shares;
    string contractTemplate;
  }

  event PyramidDeployed(address addr, PyramidArgs args);

  function deployPyramid(
    Params calldata params,
    PyramidArgs calldata args,
    bytes calldata signature
  ) external returns (address addr) {
    _checkNonce(params.nonce);

    address signer = _recoverSigner(_hashPyramid(params, args), signature);

    if (!hasRole(DEFAULT_ADMIN_ROLE, signer)) {
      revert SignerMissingRole();
    }

    addr = deploy2(params.bytecode, abi.encode(args.payees, args.shares), params.nonce);
    _pyramid_tokens.push(addr);

    emit PyramidDeployed(addr, args);

    bytes32[] memory roles = new bytes32[](2);
    roles[0] = PAUSER_ROLE;
    roles[1] = DEFAULT_ADMIN_ROLE;

    fixPermissions(addr, roles);
  }

  function _hashPyramid(Params calldata params, PyramidArgs calldata args) internal view returns (bytes32) {
    return
      _hashTypedDataV4(
        keccak256(abi.encodePacked(PYRAMID_PERMIT_SIGNATURE, _hashParamsStruct(params), _hashPyramidStruct(args)))
      );
  }

  function _hashPyramidStruct(PyramidArgs calldata args) private pure returns (bytes32) {
    return
      keccak256(
        abi.encode(
          PYRAMID_ARGUMENTS_TYPEHASH,
          keccak256(abi.encodePacked(args.payees)),
          keccak256(abi.encodePacked(args.shares)),
          keccak256(bytes(args.contractTemplate))
        )
      );
  }

  function allPyramids() external view returns (address[] memory) {
    return _pyramid_tokens;
  }
}
