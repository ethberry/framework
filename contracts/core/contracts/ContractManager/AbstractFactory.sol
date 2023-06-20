// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/Create2.sol";

import "@gemunion/contracts-misc/contracts/constants.sol";

import "../utils/constants.sol";

/**
 * @title AbstractFactory
 * @dev Utility contract provides common functionality for deployment other contracts (tokens)
 */
abstract contract AbstractFactory is EIP712, AccessControl {
  using ECDSA for bytes32;
  using EnumerableSet for EnumerableSet.AddressSet;

  mapping(bytes32 => bool) private _expired;

  bytes internal constant PARAMS_SIGNATURE = "Params(bytes32 nonce,bytes bytecode)";
  bytes32 private constant PARAMS_TYPEHASH = keccak256(PARAMS_SIGNATURE);

  EnumerableSet.AddressSet private _minters;
  EnumerableSet.AddressSet private _manipulators;

  struct Params {
    bytes32 nonce;
    bytes bytecode;
  }

  constructor() EIP712("ContractManager", "1.0.0") {
    _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
  }

  /**
   * @dev Deploys a contract using `create2` optcode.
   *
   * @param bytecode The bytecode to deploy.
   * @param arguments The constructor arguments for the contract.
   * @param nonce A random value to ensure the deployed address is unique.
   * @return addr The address of the deployed contract.
   */
  function deploy2(bytes calldata bytecode, bytes memory arguments, bytes32 nonce) internal returns (address addr) {
    // Combine `bytecode` and `arguments` into a single `bytes` array.
    bytes memory _bytecode = abi.encodePacked(bytecode, arguments);

    // Deploy the contract using `create2`
    // The deployed address will be deterministic based on `nonce` and the hash of `_bytecode`.
    return Create2.deploy(0, nonce, _bytecode);
  }

  /**
   * @dev Set the list of allowed factories for creating and manipulating tokens
   *
   * @param factory address representing the allowed token factory
   * @param role to assign
   */
  function addFactory(address factory, bytes32 role) public onlyRole(DEFAULT_ADMIN_ROLE) {
    // Add the factory address to the appropriate array
    if (role == MINTER_ROLE) {
      EnumerableSet.add(_minters, factory);
    } else if (role == METADATA_ROLE) {
      EnumerableSet.add(_manipulators, factory);
    } else if (role == DEFAULT_ADMIN_ROLE) {
      EnumerableSet.add(_minters, factory);
      EnumerableSet.add(_manipulators, factory);
    } else {
      revert("ContractManager: Wrong role");
    }
  }

  /**
   * @notice Removes a factory address from the list of minters and manipulators.
   * @param factory The address of the factory to be removed.
   * @param role to be removed.
   */
  function removeFactory(address factory, bytes32 role) public onlyRole(DEFAULT_ADMIN_ROLE) {
    if (role == MINTER_ROLE) {
      EnumerableSet.remove(_minters, factory);
    } else if (role == METADATA_ROLE) {
      EnumerableSet.remove(_manipulators, factory);
    } else if (role == DEFAULT_ADMIN_ROLE) {
      EnumerableSet.remove(_minters, factory);
      EnumerableSet.remove(_manipulators, factory);
    } else {
      revert("ContractManager: Wrong role");
    }
  }

  /**
   * @dev Get minters array
   */
  function getMinters() public view returns (address[] memory minters) {
    return EnumerableSet.values(_minters);
  }

  /**
   * @dev Get manipulators array
   */
  function getManipulators() public view returns (address[] memory manipulators) {
    return EnumerableSet.values(_manipulators);
  }

  /**
   * @dev Grants MINTER_ROLE to factories
   *
   * @param addr Address of the factory
   */
  function grantFactoryMintPermission(address addr) internal {
    // Create an instance of the contract that supports the AccessControl interface.
    IAccessControl instance = IAccessControl(addr);
    // Grant MINTER_ROLE to all _minters
    uint256 length = EnumerableSet.length(_minters);
    for (uint256 i = 0; i < length; ) {
      instance.grantRole(MINTER_ROLE, EnumerableSet.at(_minters, i));
      unchecked {
        i++;
      }
    }
  }

  /**
   * @dev Grants METADATA_ROLE to contracts that can update token's metadata
   *
   * @param addr Address of the factory that support IAccessControl
   */
  function grantFactoryMetadataPermission(address addr) internal {
    // Create an instance of the contract that supports the AccessControl interface.
    IAccessControl instance = IAccessControl(addr);
    // Grant METADATA_ROLE to all _manipulators
    uint256 length = EnumerableSet.length(_manipulators);
    for (uint256 i = 0; i < length; ) {
      instance.grantRole(METADATA_ROLE, EnumerableSet.at(_manipulators, i));
      unchecked {
        i++;
      }
    }
  }

  /**
   * @dev Grants the specified roles to the deployer of the contract.
   *
   * @param addr The address of the contract to modify permissions for.
   * @param roles An array of role IDs to modify permissions for.
   */
  function fixPermissions(address addr, bytes32[] memory roles) internal {
    // Create an instance of the contract that supports the AccessControl interface.
    IAccessControl instance = IAccessControl(addr);

    uint256 length = roles.length;
    for (uint256 i = 0; i < length; ) {
      // Grant the specified roles to the caller of the function.
      instance.grantRole(roles[i], _msgSender());
      // Renounce the specified roles from the ContractManager contract.
      instance.renounceRole(roles[i], address(this));
      unchecked {
        i++;
      }
    }
  }

  /**
   * @dev Recover the address of the signer of transaction
   *
   * @param digest The message digest that was signed.
   * @param signature The signature bytes of the signer.
   * @return The address of the signer of the message.
   */
  function _recoverSigner(bytes32 digest, bytes calldata signature) internal pure returns (address) {
    return digest.recover(signature);
  }

  /**
   * @dev Prevents transaction replay
   *
   * @param nonce The nonce of the transaction.
   */
  function _checkNonce(bytes32 nonce) internal {
    // Check that the transaction with the same nonce was not executed yet
    require(!_expired[nonce], "ContractManager: Expired signature");
    // Mark the transaction as executed.
    _expired[nonce] = true;
  }

  /**
   * @dev Computes the hash of the Params struct for signing purposes.
   *
   * @param params The Params struct to hash.
   * @return The hash of the Params struct.
   */
  function _hashParamsStruct(Params calldata params) internal pure returns (bytes32) {
    return keccak256(abi.encode(PARAMS_TYPEHASH, params.nonce, keccak256(bytes(params.bytecode))));
  }
}
