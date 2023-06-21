// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "../utils/errors.sol";
import "./AbstractFactory.sol";

/**
 * @title VestingFactory
 * @dev Extension that provides functionality for deployment of Vesting contracts
 */
contract VestingFactory is AbstractFactory {
  bytes private constant VESTING_ARGUMENTS_SIGNATURE =
    "VestingArgs(address beneficiary,uint64 startTimestamp,uint16 cliffInMonth,uint16 monthlyRelease)";
  bytes32 private constant VESTING_ARGUMENTS_TYPEHASH = keccak256(VESTING_ARGUMENTS_SIGNATURE);

  bytes32 private immutable VESTING_PERMIT_SIGNATURE =
    keccak256(bytes.concat("EIP712(Params params,VestingArgs args)", PARAMS_SIGNATURE, VESTING_ARGUMENTS_SIGNATURE));

  // Array of all deployed vesting contracts.
  address[] private _vesting;

  // Structure representing Vesting template and arguments
  struct VestingArgs {
    address beneficiary;
    uint64 startTimestamp; // in sec
    uint16 cliffInMonth; // in sec
    uint16 monthlyRelease;
  }

  event VestingDeployed(address account, uint256 externalId, VestingArgs args);

  /**
   * @dev Deploys a vesting contract with the specified arguments.
   *
   * @param params struct containing bytecode and nonce.
   * @param args The arguments for the vesting contract deployment.
   * @param signature The signature provided to verify the transaction.
   * @return account address of the deployed vesting contract
   */
  function deployVesting(
    Params calldata params,
    VestingArgs calldata args,
    bytes calldata signature
  ) external returns (address account) {
    // Check that the transaction with the same nonce was not executed yet
    _checkNonce(params.nonce);

    // Recover the signer from signature
    address signer = _recoverSigner(_hashVesting(params, args), signature);
    // verify that signer has required permissions
    if (!hasRole(DEFAULT_ADMIN_ROLE, signer)) {
      revert SignerMissingRole();
    }

    // Deploy the contract
    account = deploy2(
      params.bytecode,
      abi.encode(args.beneficiary, args.startTimestamp, args.cliffInMonth, args.monthlyRelease),
      params.nonce
    );
    // add deployed address to the list of vesting contracts
    _vesting.push(account);

    // Notify our server about successful deployment
    emit VestingDeployed(account, params.externalId, args);
  }

  /**
   * @dev Computes the hash of the vesting contract arguments and deployment params.
   *
   * @param params struct containing bytecode and nonce
   * @param args The arguments for the vesting contract deployment.
   * @return bytes32 The keccak256 hash of the arguments and params.
   */
  function _hashVesting(Params calldata params, VestingArgs calldata args) internal view returns (bytes32) {
    return
      _hashTypedDataV4(
        keccak256(abi.encodePacked(VESTING_PERMIT_SIGNATURE, _hashParamsStruct(params), _hashVestingStruct(args)))
      );
  }

  /**
   * @dev Computes the hash of the vesting contract arguments.
   *
   * @param args The arguments for the vesting contract deployment.
   * @return bytes32 The keccak256 hash of the arguments.
   */
  function _hashVestingStruct(VestingArgs calldata args) private pure returns (bytes32) {
    return
      keccak256(
        abi.encode(
          VESTING_ARGUMENTS_TYPEHASH,
          args.beneficiary,
          args.startTimestamp,
          args.cliffInMonth,
          args.monthlyRelease
        )
      );
  }

  /**
   * @dev Returns an array of all deployed vesting contract addresses.
   */
  function allVesting() external view returns (address[] memory) {
    return _vesting;
  }
}
