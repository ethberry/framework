// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "./AbstractFactory.sol";

contract VestingFactory is AbstractFactory {
  bytes private constant VESTING_PARAMS =
  "Vesting(bytes bytecode,address account,uint64 startTimestamp,uint64 duration,uint256 templateId,bytes32 nonce)";
  bytes32 private constant VESTING_PARAMS_TYPEHASH = keccak256(abi.encodePacked(VESTING_PARAMS));

  bytes32 private immutable VESTING_PERMIT_SIGNATURE =
  keccak256(bytes.concat("EIP712(Vesting v)", VESTING_PARAMS));

  address[] private _vesting;

  struct Vesting {
    bytes bytecode;
    address account;
    uint64 startTimestamp;
    uint64 duration;
    uint256 templateId;
    bytes32 nonce;
  }

  event VestingDeployed(
    address addr,
    address account,
    uint64 startTimestamp, // in seconds
    uint64 duration, // in seconds
    uint256 templateId
  );

  function deployVesting(
    Signature calldata sig,
    Vesting calldata v
  ) external onlyRole(DEFAULT_ADMIN_ROLE) returns (address addr) {
    require(hasRole(DEFAULT_ADMIN_ROLE, sig.signer), "ContractManager: Wrong signer");

    bytes32 digest = _hashVesting(v);

    _checkSignature(sig.signer, digest, sig.signature);
    _checkNonce(v.nonce);

    addr = deploy2(v.bytecode, abi.encode(v.account, v.startTimestamp, v.duration), v.nonce);
    _vesting.push(addr);

    emit VestingDeployed(addr, v.account, v.startTimestamp, v.duration, v.templateId);
  }

  function _hashVesting(Vesting calldata v) internal view returns (bytes32) {
    return _hashTypedDataV4(keccak256(abi.encode(VESTING_PERMIT_SIGNATURE, _hashVestingStruct(v))));
  }

  function _hashVestingStruct(Vesting calldata v) private pure returns (bytes32) {
    return
    keccak256(
      abi.encode(
        VESTING_PARAMS_TYPEHASH,
        keccak256(abi.encodePacked(v.bytecode)),
        v.account,
        v.startTimestamp,
        v.duration,
        v.templateId,
        v.nonce
      )
    );
  }

  function _hashVesting(Vesting calldata v) internal view returns (bytes32) {
    return _hashTypedDataV4(keccak256(abi.encode(VESTING_PERMIT_SIGNATURE, _hashVestingStruct(v))));
  }

  function _hashVestingStruct(Vesting calldata v) private pure returns (bytes32) {
    return
    keccak256(
      abi.encode(
        VESTING_PARAMS_TYPEHASH,
        keccak256(abi.encodePacked(v.bytecode)),
        v.account,
        v.startTimestamp,
        v.duration,
        v.templateId,
        v.nonce
      )
    );
  }

  function allVesting() external view returns (address[] memory) {
    return _vesting;
  }
}
