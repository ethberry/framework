// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "./AbstractFactory.sol";

contract ERC721Factory is AbstractFactory {
  bytes32 private immutable ERC721_PERMIT_SIGNATURE =
    keccak256(
      "EIP712(bytes32 nonce,bytes bytecode,string name,string symbol,uint96 royalty,string baseTokenURI,uint8[] featureIds)"
    );

  address[] private _erc721_tokens;

  event ERC721TokenDeployed(
    address addr,
    string name,
    string symbol,
    uint96 royalty,
    string baseTokenURI,
    uint8[] featureIds
  );

  function deployERC721Token(
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

    bytes32 digest = _hashERC721(nonce, bytecode, name, symbol, royalty, baseTokenURI, featureIds);

    _checkSignature(signer, digest, signature);
    _checkNonce(nonce);

    addr = deploy(bytecode, abi.encode(name, symbol, royalty, baseTokenURI));
    _erc721_tokens.push(addr);

    emit ERC721TokenDeployed(addr, name, symbol, royalty, baseTokenURI, featureIds);

    bytes32[] memory roles = new bytes32[](2);
    roles[0] = MINTER_ROLE;
    roles[1] = DEFAULT_ADMIN_ROLE;

    grantFactoryMintPermission(addr);
    grantFactoryMetadataPermission(addr);
    fixPermissions(addr, roles);
  }

  function _hashERC721(
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
            ERC721_PERMIT_SIGNATURE,
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

  function allERC721Tokens() external view returns (address[] memory) {
    return _erc721_tokens;
  }
}
