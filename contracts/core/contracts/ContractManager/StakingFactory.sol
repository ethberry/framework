// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "./AbstractFactory.sol";

contract StakingFactory is AbstractFactory {
  bytes private constant STAKING_ARGUMENTS_SIGNATURE = "StakingArgs(uint256 maxStake,uint8[] featureIds)";
  bytes32 private constant STAKING_ARGUMENTS_TYPEHASH = keccak256(abi.encodePacked(STAKING_ARGUMENTS_SIGNATURE));

  bytes32 private immutable STAKING_PERMIT_SIGNATURE =
    keccak256(bytes.concat("EIP712(Params params,StakingArgs args)", PARAMS_SIGNATURE, STAKING_ARGUMENTS_SIGNATURE));

  address[] private _staking;

  struct StakingArgs {
    uint256 maxStake;
    uint8[] featureIds;
  }

  event StakingDeployed(address addr, StakingArgs args);

  function deployStaking(
    Params calldata params,
    StakingArgs calldata args,
    bytes calldata signature
  ) external onlyRole(DEFAULT_ADMIN_ROLE) returns (address addr) {
    _checkNonce(params.nonce);

    address signer = _recoverSigner(_hashStaking(params, args), signature);
    require(hasRole(DEFAULT_ADMIN_ROLE, signer), "ContractManager: Wrong signer");

    addr = deploy2(params.bytecode, abi.encode(args.maxStake), params.nonce);
    _staking.push(addr);

    emit StakingDeployed(addr, args);
  }

  function _hashStaking(Params calldata params, StakingArgs calldata args) internal view returns (bytes32) {
    return
      _hashTypedDataV4(
        keccak256(abi.encode(STAKING_PERMIT_SIGNATURE, _hashParamsStruct(params), _hashStakingStruct(args)))
      );
  }

  function _hashStakingStruct(StakingArgs calldata args) private pure returns (bytes32) {
    return
      keccak256(abi.encode(STAKING_ARGUMENTS_TYPEHASH, args.maxStake, keccak256(abi.encodePacked(args.featureIds))));
  }

  function allStaking() external view returns (address[] memory) {
    return _staking;
  }
}
