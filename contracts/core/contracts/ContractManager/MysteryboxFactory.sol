// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "@gemunion/contracts/contracts/ContractManager/AbstractFactory.sol";

contract MysteryboxFactory is AbstractFactory {
  bytes32 private immutable MYSTERYBOX_PERMIT_SIGNATURE =
    keccak256(
      "EIP712(bytes32 nonce,bytes bytecode,string name,string symbol,uint96 royalty,string baseTokenURI,uint8[] featureIds)"
    );

  address[] private _mysterybox_tokens;

  event MysteryboxDeployed(
    address addr,
    string name,
    string symbol,
    uint96 royalty,
    string baseTokenURI,
    uint8[] featureIds
  );

  function deployMysterybox(
    bytes32 nonce,
    bytes calldata bytecode,
    string memory name,
    string memory symbol,
    uint96 royalty,
    string memory baseTokenURI,
    uint8[] calldata featureIds,
    address signer,
    bytes calldata signature
  ) external onlyRole(DEFAULT_ADMIN_ROLE) returns (address addr) {
    require(hasRole(DEFAULT_ADMIN_ROLE, signer), "ContractManager: Wrong signer");

    bytes32 digest = _hashMysterybox(nonce, bytecode, name, symbol, royalty, baseTokenURI, featureIds);

    _checkSignature(signer, digest, signature);
    _checkNonce(nonce);

    addr = deploy(bytecode, abi.encode(name, symbol, royalty, baseTokenURI));
    _mysterybox_tokens.push(addr);

    emit MysteryboxDeployed(addr, name, symbol, royalty, baseTokenURI, featureIds);

    bytes32[] memory roles = new bytes32[](2);
    roles[0] = MINTER_ROLE;
    roles[1] = DEFAULT_ADMIN_ROLE;

    grantFactoryMintPermission(addr);
    grantFactoryMetadataPermission(addr);
    fixPermissions(addr, roles);
    addFactory(addr, MINTER_ROLE);
  }

  function _hashMysterybox(
    bytes32 nonce,
    bytes calldata bytecode,
    string memory name,
    string memory symbol,
    uint96 royalty,
    string memory baseTokenURI,
    uint8[] calldata featureIds
  ) internal view returns (bytes32) {
    return
      _hashTypedDataV4(
        keccak256(
          abi.encode(
            MYSTERYBOX_PERMIT_SIGNATURE,
            nonce,
            keccak256(abi.encodePacked(bytecode)),
            keccak256(abi.encodePacked(name)),
            keccak256(abi.encodePacked(symbol)),
            royalty,
            keccak256(abi.encodePacked(baseTokenURI)),
            keccak256(abi.encodePacked(featureIds))
          )
        )
      );
  }

  function allMysteryboxes() external view returns (address[] memory) {
    return _mysterybox_tokens;
  }
}
