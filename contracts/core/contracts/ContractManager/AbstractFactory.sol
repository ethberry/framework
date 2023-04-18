// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/Create2.sol";

import "../utils/constants.sol";

abstract contract AbstractFactory is EIP712, AccessControl {
  bytes32 constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
  bytes32 constant MINTER_ROLE = keccak256("MINTER_ROLE");
  bytes32 constant SNAPSHOT_ROLE = keccak256("SNAPSHOT_ROLE");
  bytes32 constant METADATA_ROLE = keccak256("METADATA_ROLE");

  using ECDSA for bytes32;
  using EnumerableSet for EnumerableSet.AddressSet;

  mapping(bytes32 => bool) private _expired;

  bytes internal constant PARAMS_SIGNATURE = "Params(bytes32 nonce,bytes bytecode)";
  bytes32 private constant PARAMS_TYPEHASH = keccak256(abi.encodePacked(PARAMS_SIGNATURE));

  EnumerableSet.AddressSet private _minters;
  EnumerableSet.AddressSet private _manipulators;

  struct Params {
    bytes32 nonce;
    bytes bytecode;
  }

  constructor() EIP712("ContractManager", "1.0.0") {
    _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
  }

  function deploy2(bytes calldata bytecode, bytes memory arguments, bytes32 nonce) internal returns (address addr) {
    bytes memory _bytecode = abi.encodePacked(bytecode, arguments);

    return Create2.deploy(0, nonce, _bytecode);
  }

  function addFactory(address factory, bytes32 role) public onlyRole(DEFAULT_ADMIN_ROLE) {
    require((role == MINTER_ROLE || role == METADATA_ROLE), "ContractManager: Wrong role");

    if (role == MINTER_ROLE) {
      require(!EnumerableSet.contains(_minters, factory), "ContractManager: Factory exists");
      EnumerableSet.add(_minters, factory);
    } else if (role == METADATA_ROLE) {
      require(!EnumerableSet.contains(_manipulators, factory), "ContractManager: Factory exists");
      EnumerableSet.add(_manipulators, factory);
    }
  }

  function removeFactory(address factory, bytes32 role) public onlyRole(DEFAULT_ADMIN_ROLE) {
    require(
      (role == MINTER_ROLE || role == METADATA_ROLE || role == DEFAULT_ADMIN_ROLE),
      "ContractManager: Wrong role"
    );

    if (role == MINTER_ROLE) {
      EnumerableSet.remove(_minters, factory);
    } else if (role == METADATA_ROLE) {
      EnumerableSet.remove(_manipulators, factory);
    } else if (role == DEFAULT_ADMIN_ROLE) {
      EnumerableSet.remove(_minters, factory);
      EnumerableSet.remove(_manipulators, factory);
    }
  }

  // DEV
  function getMinters() public view onlyRole(DEFAULT_ADMIN_ROLE) returns (address[] memory minters) {
    return EnumerableSet.values(_minters);
  }

  function getManipulators() public view onlyRole(DEFAULT_ADMIN_ROLE) returns (address[] memory manipulators) {
    return EnumerableSet.values(_manipulators);
  }

  function grantFactoryMintPermission(address addr) internal {
    IAccessControl instance = IAccessControl(addr);
    for (uint256 i = 0; i < EnumerableSet.length(_minters); i++) {
      instance.grantRole(MINTER_ROLE, EnumerableSet.at(_minters, i));
    }
  }

  function grantFactoryMetadataPermission(address addr) internal {
    IAccessControl instance = IAccessControl(addr);
    for (uint256 i = 0; i < EnumerableSet.length(_manipulators); i++) {
      instance.grantRole(METADATA_ROLE, EnumerableSet.at(_manipulators, i));
    }
  }

  function fixPermissions(address addr, bytes32[] memory roles) internal {
    IAccessControl instance = IAccessControl(addr);
    for (uint256 i = 0; i < roles.length; i++) {
      instance.grantRole(roles[i], _msgSender());
      instance.renounceRole(roles[i], address(this));
    }
  }

  function _recoverSigner(bytes32 digest, bytes calldata signature) internal pure returns (address) {
    return digest.recover(signature);
  }

  function _checkNonce(bytes32 nonce) internal {
    require(!_expired[nonce], "ContractManager: Expired signature");
    _expired[nonce] = true;
  }

  function _hashParamsStruct(Params calldata params) internal pure returns (bytes32) {
    return keccak256(abi.encode(PARAMS_TYPEHASH, params.nonce, keccak256(abi.encodePacked(params.bytecode))));
  }
}
