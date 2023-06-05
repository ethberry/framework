// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "../utils/errors.sol";
import "./AbstractFactory.sol";

contract StakingFactory is AbstractFactory {
  bytes private constant STAKING_ARGUMENTS_SIGNATURE = "StakingArgs(string contractTemplate)";
  bytes32 private constant STAKING_ARGUMENTS_TYPEHASH = keccak256(abi.encodePacked(STAKING_ARGUMENTS_SIGNATURE));

  bytes32 private immutable STAKING_PERMIT_SIGNATURE =
    keccak256(bytes.concat("EIP712(Params params,StakingArgs args)", PARAMS_SIGNATURE, STAKING_ARGUMENTS_SIGNATURE));

  address[] private _staking;

  struct StakingArgs {
    string contractTemplate;
  }

  event StakingDeployed(address addr, StakingArgs args);

  function deployStaking(
    Params calldata params,
    StakingArgs calldata args,
    bytes calldata signature
  ) external returns (address addr) {
    _checkNonce(params.nonce);

    address signer = _recoverSigner(_hashStaking(params, args), signature);

    if (!hasRole(DEFAULT_ADMIN_ROLE, signer)) {
      revert SignerMissingRole();
    }

    addr = deploy2(params.bytecode, "", params.nonce);
    _staking.push(addr);

    emit StakingDeployed(addr, args);
  }

  function _hashStaking(Params calldata params, StakingArgs calldata args) internal view returns (bytes32) {
    return
      _hashTypedDataV4(
        keccak256(abi.encodePacked(STAKING_PERMIT_SIGNATURE, _hashParamsStruct(params), _hashStakingStruct(args)))
      );
  }

  function _hashStakingStruct(StakingArgs calldata args) private pure returns (bytes32) {
    return keccak256(abi.encode(STAKING_ARGUMENTS_TYPEHASH, keccak256(abi.encodePacked(args.contractTemplate))));
  }

  function allStaking() external view returns (address[] memory) {
    return _staking;
  }
}
