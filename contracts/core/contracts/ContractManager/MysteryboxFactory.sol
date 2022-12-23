// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "./AbstractFactory.sol";

contract MysteryboxFactory is AbstractFactory {
  bytes private constant MYSTERYBOX_PARAMS =
  "Mystery(bytes bytecode,string name,string symbol,uint96 royalty,string baseTokenURI,uint8[] featureIds,bytes32 nonce)";
  bytes32 private constant MYSTERYBOX_PARAMS_TYPEHASH = keccak256(abi.encodePacked(MYSTERYBOX_PARAMS));

  bytes32 private immutable MYSTERYBOX_PERMIT_SIGNATURE =
  keccak256(bytes.concat("EIP712(Mystery m)", MYSTERYBOX_PARAMS));

//  bytes32 private immutable MYSTERYBOX_PERMIT_SIGNATURE =
//    keccak256(
//      "EIP712(bytes32 nonce,bytes bytecode,string name,string symbol,uint96 royalty,string baseTokenURI,uint8[] featureIds)"
//    );

  address[] private _mysterybox_tokens;

  struct Mystery {
    bytes bytecode;
    string name;
    string symbol;
    uint96 royalty;
    string baseTokenURI;
    uint8[] featureIds;
    bytes32 nonce;
  }

  event MysteryboxDeployed(
    address addr,
    string name,
    string symbol,
    uint96 royalty,
    string baseTokenURI,
    uint8[] featureIds
  );

  function deployMysterybox(
    Signature calldata sig,
    Mystery calldata m
  ) external onlyRole(DEFAULT_ADMIN_ROLE) returns (address addr) {
    require(hasRole(DEFAULT_ADMIN_ROLE, sig.signer), "ContractManager: Wrong signer");

    bytes32 digest = _hashMysterybox(m);

    _checkSignature(sig.signer, digest, sig.signature);
    _checkNonce(m.nonce);

//    addr = deploy(bytecode, abi.encode(name, symbol, royalty, baseTokenURI));
    addr = deploy2(m.bytecode, abi.encode(m.name, m.symbol, m.royalty, m.baseTokenURI), m.nonce);
    _mysterybox_tokens.push(addr);

    emit MysteryboxDeployed(addr, m.name, m.symbol, m.royalty, m.baseTokenURI, m.featureIds);

    bytes32[] memory roles = new bytes32[](2);
    roles[0] = MINTER_ROLE;
    roles[1] = DEFAULT_ADMIN_ROLE;

    grantFactoryMintPermission(addr);
    grantFactoryMetadataPermission(addr);
    fixPermissions(addr, roles);
    addFactory(addr, MINTER_ROLE);
  }

  function _hashMysterybox(Mystery calldata m) internal view returns (bytes32) {
    return _hashTypedDataV4(keccak256(abi.encode(MYSTERYBOX_PERMIT_SIGNATURE, _hashMysteryStruct(m))));
  }

  function _hashMysteryStruct(Mystery calldata m) private pure returns (bytes32) {
    return
    keccak256(
      abi.encode(
        MYSTERYBOX_PARAMS_TYPEHASH,
        keccak256(abi.encodePacked(m.bytecode)),
        keccak256(abi.encodePacked(m.name)),
        keccak256(abi.encodePacked(m.symbol)),
        m.royalty,
        keccak256(abi.encodePacked(m.baseTokenURI)),
        keccak256(abi.encodePacked(m.featureIds)),
        m.nonce
      )
    );
  }

  function allMysteryboxes() external view returns (address[] memory) {
    return _mysterybox_tokens;
  }
}
