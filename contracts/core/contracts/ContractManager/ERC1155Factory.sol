// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "./AbstractFactory.sol";

contract ERC1155Factory is AbstractFactory {
  bytes private constant ERC1155_PARAMS =
  "Erc1155(bytes bytecode,uint96 royalty,string baseTokenURI,uint8[] featureIds,bytes32 nonce)";
  bytes32 private constant ERC1155_PARAMS_TYPEHASH = keccak256(abi.encodePacked(ERC1155_PARAMS));

  bytes32 private immutable ERC1155_PERMIT_SIGNATURE =
  keccak256(bytes.concat("EIP712(Erc1155 c)", ERC1155_PARAMS));

  address[] private _erc1155_tokens;

  struct Erc1155 {
    bytes bytecode;
    uint96 royalty;
    string baseTokenURI;
    uint8[] featureIds;
    bytes32 nonce;
  }

  event ERC1155TokenDeployed(address addr, uint96 royalty, string baseTokenURI, uint8[] featureIds);

  function deployERC1155Token(
    Signature calldata sig,
    Erc1155 calldata c
  ) external onlyRole(DEFAULT_ADMIN_ROLE) returns (address addr) {
    require(hasRole(DEFAULT_ADMIN_ROLE, sig.signer), "ContractManager: Wrong signer");

    bytes32 digest = _hashERC1155(c);

    _checkSignature(sig.signer, digest, sig.signature);
    _checkNonce(c.nonce);

//    addr = deploy(bytecode, abi.encode(royalty, baseTokenURI));
    addr = deploy2(c.bytecode, abi.encode(c.royalty, c.baseTokenURI), c.nonce);
    _erc1155_tokens.push(addr);

    emit ERC1155TokenDeployed(addr, c.royalty, c.baseTokenURI, c.featureIds);

    bytes32[] memory roles = new bytes32[](2);
    roles[0] = MINTER_ROLE;
    roles[1] = DEFAULT_ADMIN_ROLE;

    grantFactoryMintPermission(addr);
    fixPermissions(addr, roles);
  }

  function _hashERC1155(Erc1155 calldata c) internal view returns (bytes32) {
    return _hashTypedDataV4(keccak256(abi.encode(ERC1155_PERMIT_SIGNATURE, _hashErc1155Struct(c))));
  }

  function _hashErc1155Struct(Erc1155 calldata c) private pure returns (bytes32) {
    return
    keccak256(
      abi.encode(
        ERC1155_PARAMS_TYPEHASH,
        keccak256(abi.encodePacked(c.bytecode)),
        c.royalty,
        keccak256(abi.encodePacked(c.baseTokenURI)),
        keccak256(abi.encodePacked(c.featureIds)),
        c.nonce
      )
    );
  }

  function allERC1155Tokens() external view returns (address[] memory) {
    return _erc1155_tokens;
  }
}
