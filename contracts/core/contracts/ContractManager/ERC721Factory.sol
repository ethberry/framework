// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "./AbstractFactory.sol";

contract ERC721Factory is AbstractFactory {
  bytes private constant ERC721_PARAMS =
  "Erc721(bytes bytecode,string name,string symbol,string baseTokenURI,uint8[] featureIds,uint96 royalty,bytes32 nonce)";
  bytes32 private constant ERC721_PARAMS_TYPEHASH = keccak256(abi.encodePacked(ERC721_PARAMS));

  bytes32 private immutable ERC721_PERMIT_SIGNATURE =
  keccak256(bytes.concat("EIP712(Erc721 c)", ERC721_PARAMS));

//  bytes32 private immutable ERC721_PERMIT_SIGNATURE =
//    keccak256(
//      "EIP712(bytes32 nonce,bytes bytecode,string name,string symbol,uint96 royalty,string baseTokenURI,uint8[] featureIds)"
//    );

  address[] private _erc721_tokens;

  struct Erc721 {
    bytes bytecode;
    string name;
    string symbol;
    string baseTokenURI;
    uint8[] featureIds;
    uint96 royalty;
    bytes32 nonce;
  }

  event ERC721TokenDeployed(
    address addr,
    string name,
    string symbol,
    uint96 royalty,
    string baseTokenURI,
    uint8[] featureIds
  );

  function deployERC721Token(
    Signature calldata sig,
    Erc721 calldata c
  ) external onlyRole(DEFAULT_ADMIN_ROLE) returns (address addr) {
    require(hasRole(DEFAULT_ADMIN_ROLE, sig.signer), "ContractManager: Wrong signer");

    bytes32 digest = _hashERC721(c);

    _checkSignature(sig.signer, digest, sig.signature);
    _checkNonce(c.nonce);

//    addr = deploy(bytecode, abi.encode(name, symbol, royalty, baseTokenURI));
    addr = deploy2(c.bytecode, abi.encode(c.name, c.symbol, c.royalty, c.baseTokenURI), c.nonce);
    _erc721_tokens.push(addr);

    emit ERC721TokenDeployed(addr, c.name, c.symbol, c.royalty, c.baseTokenURI, c.featureIds);

    bytes32[] memory roles = new bytes32[](2);
    roles[0] = MINTER_ROLE;
    roles[1] = DEFAULT_ADMIN_ROLE;

    grantFactoryMintPermission(addr);
    grantFactoryMetadataPermission(addr);
    fixPermissions(addr, roles);
  }

  function _hashERC721(Erc721 calldata c) internal view returns (bytes32) {
    return _hashTypedDataV4(keccak256(abi.encode(ERC721_PERMIT_SIGNATURE, _hashErc721Struct(c))));
  }

  function _hashErc721Struct(Erc721 calldata c) private pure returns (bytes32) {
    return
    keccak256(
      abi.encode(
        ERC721_PARAMS_TYPEHASH,
        keccak256(abi.encodePacked(c.bytecode)),
        keccak256(abi.encodePacked(c.name)),
        keccak256(abi.encodePacked(c.symbol)),
        keccak256(abi.encodePacked(c.baseTokenURI)),
        keccak256(abi.encodePacked(c.featureIds)),
        c.royalty,
        c.nonce
      )
    );
  }

  function allERC721Tokens() external view returns (address[] memory) {
    return _erc721_tokens;
  }
}
