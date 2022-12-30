// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "./AbstractFactory.sol";

contract StakingFactory is AbstractFactory {
  bytes private constant STAKING_PARAMS =
  "Staking(bytes bytecode,uint256 maxStake,uint8[] featureIds,bytes32 nonce)";
  bytes32 private constant STAKING_PARAMS_TYPEHASH = keccak256(abi.encodePacked(STAKING_PARAMS));

  bytes32 private immutable STAKING_PERMIT_SIGNATURE =
  keccak256(bytes.concat("EIP712(Staking s)", STAKING_PARAMS));

  address[] private _staking;

  struct Staking {
    bytes bytecode;
    uint256 maxStake;
    uint8[] featureIds;
    bytes32 nonce;
  }

  event StakingDeployed(
    address addr,
    uint256 maxStake,
    uint8[] featureIds
  );

  function deployStaking(
    Signature calldata sig,
    Staking calldata s
  ) external onlyRole(DEFAULT_ADMIN_ROLE) returns (address addr) {
    require(hasRole(DEFAULT_ADMIN_ROLE, sig.signer), "ContractManager: Wrong signer");

    bytes32 digest = _hashStaking(s);

    _checkSignature(sig.signer, digest, sig.signature);
    _checkNonce(s.nonce);

    addr = deploy2(s.bytecode, abi.encode(s.maxStake), s.nonce);
    _staking.push(addr);

    emit StakingDeployed(addr, s.maxStake, s.featureIds);
  }

  function _hashStaking(Staking calldata s) internal view returns (bytes32) {
    return _hashTypedDataV4(keccak256(abi.encode(STAKING_PERMIT_SIGNATURE, _hashStakingStruct(s))));
  }

  function _hashStakingStruct(Staking calldata s) private pure returns (bytes32) {
    return
    keccak256(
      abi.encode(
        STAKING_PARAMS_TYPEHASH,
        keccak256(abi.encodePacked(s.bytecode)),
        s.maxStake,
        keccak256(abi.encodePacked(s.featureIds)),
        s.nonce
      )
    );
  }

  function allStaking() external view returns (address[] memory) {
    return _staking;
  }
}
