// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

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

  mapping(bytes32 => bool) private _expired;

  bytes internal constant PARAMS_SIGNATURE = "Params(bytes32 nonce,bytes bytecode)";
  bytes32 private constant PARAMS_TYPEHASH = keccak256(abi.encodePacked(PARAMS_SIGNATURE));

  address[] _minters;
  mapping(address => bool) private mintersExists;
  address[] _manipulators;
  mapping(address => bool) private manipulatorsExists;

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
      require(!mintersExists[factory], "ContractManager: Factory exists");
      _minters.push(factory);
      mintersExists[factory] = true;
    } else if (role == METADATA_ROLE) {
      require(!manipulatorsExists[factory], "ContractManager: Factory exists");
      _manipulators.push(factory);
      manipulatorsExists[factory] = true;
    }
  }

  function removeFactory(address factory, bytes32 role) public onlyRole(DEFAULT_ADMIN_ROLE) {
    require(
      (role == MINTER_ROLE || role == METADATA_ROLE || role == DEFAULT_ADMIN_ROLE),
      "ContractManager: Wrong role"
    );

    if (role == MINTER_ROLE) {
      for (uint256 i = 0; i < _minters.length; i++) {
        if (_minters[i] == factory) {
          for (uint256 j = i; j < _minters.length - 1; j++) {
            _minters[j] = _minters[j + 1];
          }
          _minters.pop(); // delete the last item
        }
      }
    } else if (role == METADATA_ROLE) {
      for (uint256 i = 0; i < _manipulators.length; i++) {
        if (_manipulators[i] == factory) {
          for (uint256 j = i; j < _manipulators.length - 1; j++) {
            _manipulators[j] = _manipulators[j + 1];
          }
          _manipulators.pop(); // delete the last item
        }
      }
    } else if (role == DEFAULT_ADMIN_ROLE) {
      for (uint256 i = 0; i < _minters.length; i++) {
        if (_minters[i] == factory) {
          for (uint256 j = i; j < _minters.length - 1; j++) {
            _minters[j] = _minters[j + 1];
          }
          _minters.pop(); // delete the last item
        }
      }
      for (uint256 i = 0; i < _manipulators.length; i++) {
        if (_manipulators[i] == factory) {
          for (uint256 j = i; j < _manipulators.length - 1; j++) {
            _manipulators[j] = _manipulators[j + 1];
          }
          _manipulators.pop(); // delete the last item
        }
      }
    }
  }

  // DEV
  function getMinters() public view onlyRole(DEFAULT_ADMIN_ROLE) returns (address[] memory minters) {
    return _minters;
  }

  function getManipulators() public view onlyRole(DEFAULT_ADMIN_ROLE) returns (address[] memory manipulators) {
    return _manipulators;
  }

  function grantFactoryMintPermission(address addr) internal {
    IAccessControl instance = IAccessControl(addr);
    for (uint256 i = 0; i < _minters.length; i++) {
      instance.grantRole(MINTER_ROLE, _minters[i]);
    }
  }

  function grantFactoryMetadataPermission(address addr) internal {
    IAccessControl instance = IAccessControl(addr);
    for (uint256 i = 0; i < _manipulators.length; i++) {
      instance.grantRole(METADATA_ROLE, _manipulators[i]);
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
