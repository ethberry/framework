// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.20;

import "./AbstractFactoryFacet.sol";

contract StakingFactoryFacet is AbstractFactoryFacet, SignatureValidatorCM {
  constructor() SignatureValidatorCM() {}

  bytes private constant STAKING_ARGUMENTS_SIGNATURE = "StakingArgs(string contractTemplate)";
  bytes32 private constant STAKING_ARGUMENTS_TYPEHASH = keccak256(STAKING_ARGUMENTS_SIGNATURE);

  bytes32 private immutable STAKING_PERMIT_SIGNATURE =
    keccak256(bytes.concat("EIP712(Params params,StakingArgs args)", PARAMS_SIGNATURE, STAKING_ARGUMENTS_SIGNATURE));

  struct StakingArgs {
    string contractTemplate;
  }

  event StakingDeployed(address account, uint256 externalId, StakingArgs args);

  function deployStaking(
    Params calldata params,
    StakingArgs calldata args,
    bytes calldata signature
  ) external returns (address account) {
    _checkNonce(params.nonce);

    address signer = _recoverSigner(_hashStaking(params, args), signature);

    if (!_hasRole(DEFAULT_ADMIN_ROLE, signer)) {
      revert SignerMissingRole();
    }

    account = deploy2(params.bytecode, "", params.nonce);

    emit StakingDeployed(account, params.externalId, args);
  }

  function _hashStaking(Params calldata params, StakingArgs calldata args) internal view returns (bytes32) {
    return
      _hashTypedDataV4(
        keccak256(abi.encodePacked(STAKING_PERMIT_SIGNATURE, _hashParamsStruct(params), _hashStakingStruct(args)))
      );
  }

  function _hashStakingStruct(StakingArgs calldata args) private pure returns (bytes32) {
    return keccak256(abi.encode(STAKING_ARGUMENTS_TYPEHASH, keccak256(bytes(args.contractTemplate))));
  }
}
