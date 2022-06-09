// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity >=0.8.13;

import "@gemunion/contracts/contracts/ContractManager/ERC20VestingFactory.sol";

contract StakingFactory is AbstractFactory {
  bytes32 private immutable ERC20_PERMIT_SIGNATURE =
  keccak256("EIP712(bytes32 nonce,bytes bytecode,uint256 templateId)");
  bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

  address[] private _staking;

  event StakingDeployed(address addr, uint256 templateId);

  function deployStaking(
    bytes32 nonce,
    bytes calldata bytecode,
    uint256 templateId,
    address signer,
    bytes calldata signature
  ) external onlyRole(DEFAULT_ADMIN_ROLE) returns (address addr) {
    require(hasRole(DEFAULT_ADMIN_ROLE, signer), "ContractManager: Wrong signer");

    bytes32 digest = _hash(nonce, bytecode, templateId);

    _checkSignature(signer, digest, signature);
    _checkNonce(nonce);

    addr = deploy(bytecode, "0x");
    _staking.push(addr);

    emit StakingDeployed(addr, templateId);

    bytes32[] memory roles = new bytes32[](3);
    roles[0] = PAUSER_ROLE;
    roles[1] = DEFAULT_ADMIN_ROLE;

    fixPermissions(addr, roles);
  }

  function _hash(
    bytes32 nonce,
    bytes calldata bytecode,
    uint256 templateId
  ) internal view returns (bytes32) {
    return
    _hashTypedDataV4(
      keccak256(
        abi.encode(
          ERC20_PERMIT_SIGNATURE,
          nonce,
          keccak256(abi.encodePacked(bytecode)),
          templateId
        )
      )
    );
  }

  function allStaking() external view returns (address[] memory) {
    return _staking;
  }
}
