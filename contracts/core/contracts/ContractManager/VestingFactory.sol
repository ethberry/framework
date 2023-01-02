// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "./AbstractFactory.sol";

import "hardhat/console.sol";

contract VestingFactory is AbstractFactory {
  bytes private constant VESTING_ARGUMENTS_SIGNATURE =
    "VestingArgs(address account,uint64 startTimestamp,uint64 duration,uint256 templateId)";
  bytes32 private constant VESTING_ARGUMENTS_TYPEHASH = keccak256(abi.encodePacked(VESTING_ARGUMENTS_SIGNATURE));

  bytes32 private immutable VESTING_PERMIT_SIGNATURE =
    keccak256(bytes.concat("EIP712(Params params,VestingArgs args)", PARAMS_SIGNATURE, VESTING_ARGUMENTS_SIGNATURE));

  address[] private _vesting;

  struct VestingArgs {
    address account;
    uint64 startTimestamp;
    uint64 duration;
    uint256 templateId;
  }

  event VestingDeployed(
    address addr,
    address account,
    uint64 startTimestamp, // in seconds
    uint64 duration, // in seconds
    uint256 templateId
  );

  function deployVesting(
    Params calldata params,
    VestingArgs calldata args,
    bytes calldata signature
  ) external onlyRole(DEFAULT_ADMIN_ROLE) returns (address addr) {
    _checkNonce(params.nonce);

    require(
      hasRole(DEFAULT_ADMIN_ROLE, _recoverSigner(_hashVesting(params, args), signature)),
      "ContractManager: Wrong signer"
    );

    addr = deploy2(params.bytecode, abi.encode(args.account, args.startTimestamp, args.duration), params.nonce);
    _vesting.push(addr);

    emit VestingDeployed(addr, args.account, args.startTimestamp, args.duration, args.templateId);
  }

  function _hashVesting(Params calldata params, VestingArgs calldata args) internal view returns (bytes32) {
    return
      _hashTypedDataV4(
        keccak256(abi.encode(VESTING_PERMIT_SIGNATURE, _hashParamsStruct(params), _hashVestingStruct(args)))
      );
  }

  function _hashVestingStruct(VestingArgs calldata args) private pure returns (bytes32) {
    return
      keccak256(
        abi.encode(VESTING_ARGUMENTS_TYPEHASH, args.account, args.startTimestamp, args.duration, args.templateId)
      );
  }

  function allVesting() external view returns (address[] memory) {
    return _vesting;
  }
}
