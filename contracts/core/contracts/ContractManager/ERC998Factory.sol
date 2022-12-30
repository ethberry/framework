// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "./AbstractFactory.sol";

contract ERC998Factory is AbstractFactory {
  bytes private constant ERC998_PARAMS =
  "Erc998(bytes bytecode,string name,string symbol,uint96 royalty,string baseTokenURI,uint8[] featureIds,bytes32 nonce)";
  bytes32 private constant ERC998_PARAMS_TYPEHASH = keccak256(abi.encodePacked(ERC998_PARAMS));

  bytes32 private immutable ERC998_PERMIT_SIGNATURE =
  keccak256(bytes.concat("EIP712(Erc998 c)", ERC998_PARAMS));

  address[] private _erc998_tokens;

  struct Erc998 {
    bytes bytecode;
    string name;
    string symbol;
    uint96 royalty;
    string baseTokenURI;
    uint8[] featureIds;
    bytes32 nonce;
  }

  event ERC998TokenDeployed(
    address addr,
    string name,
    string symbol,
    uint96 royalty,
    string baseTokenURI,
    uint8[] featureIds
  );

  function deployERC998Token(
    Signature calldata sig,
    Erc998 calldata c
  ) external onlyRole(DEFAULT_ADMIN_ROLE) returns (address addr) {
    require(hasRole(DEFAULT_ADMIN_ROLE, sig.signer), "ContractManager: Wrong signer");

    bytes32 digest = _hashERC998(c);

    _checkSignature(sig.signer, digest, sig.signature);
    _checkNonce(c.nonce);

//    addr = deploy(bytecode, abi.encode(name, symbol, royalty, baseTokenURI));
    addr = deploy2(c.bytecode, abi.encode(c.name, c.symbol, c.royalty, c.baseTokenURI), c.nonce);
    _erc998_tokens.push(addr);

    emit ERC998TokenDeployed(addr, c.name, c.symbol, c.royalty, c.baseTokenURI, c.featureIds);

    bytes32[] memory roles = new bytes32[](2);
    roles[0] = MINTER_ROLE;
    roles[1] = DEFAULT_ADMIN_ROLE;

    grantFactoryMintPermission(addr);
    grantFactoryMetadataPermission(addr);
    fixPermissions(addr, roles);
  }

  function _hashERC998(Erc998 calldata c) internal view returns (bytes32) {
    return _hashTypedDataV4(keccak256(abi.encode(ERC998_PERMIT_SIGNATURE, _hashErc998Struct(c))));
  }

  function _hashErc998Struct(Erc998 calldata c) private pure returns (bytes32) {
    return
    keccak256(
      abi.encode(
        ERC998_PARAMS_TYPEHASH,
        keccak256(abi.encodePacked(c.bytecode)),
        keccak256(abi.encodePacked(c.name)),
        keccak256(abi.encodePacked(c.symbol)),
        c.royalty,
        keccak256(abi.encodePacked(c.baseTokenURI)),
        keccak256(abi.encodePacked(c.featureIds)),
        c.nonce
      )
    );
  }

  function allERC998Tokens() external view returns (address[] memory) {
    return _erc998_tokens;
  }
}
