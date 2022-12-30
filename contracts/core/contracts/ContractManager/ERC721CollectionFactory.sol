// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;
import "./AbstractFactory.sol";

contract ERC721CollectionFactory is AbstractFactory {
  bytes private constant COLLECTION_PARAMS =
    "Collection(bytes bytecode,string name,string symbol,string baseTokenURI,uint8[] featureIds,uint96 royalty,uint96 batchSize,bytes32 nonce)";
  bytes32 private constant COLLECTION_PARAMS_TYPEHASH = keccak256(abi.encodePacked(COLLECTION_PARAMS));

  bytes32 private immutable ERC721_COLLECTION_PERMIT_SIGNATURE =
    keccak256(bytes.concat("EIP712(Collection c)", COLLECTION_PARAMS));

  address[] private _erc721_collections;

  struct Collection {
    bytes bytecode;
    string name;
    string symbol;
    string baseTokenURI;
    uint8[] featureIds;
    uint96 royalty;
    uint96 batchSize;
    bytes32 nonce;
  }

  event ERC721CollectionDeployed(
    address addr,
    string name,
    string symbol,
    uint96 royalty,
    string baseTokenURI,
    uint8[] featureIds,
    uint96 batchSize,
    address owner
  );

  function deployERC721Collection(
    Signature calldata sig,
    Collection calldata c
  ) external onlyRole(DEFAULT_ADMIN_ROLE) returns (address addr) {
    require(hasRole(DEFAULT_ADMIN_ROLE, sig.signer), "ContractManager: Wrong signer");

    bytes32 digest = _hashERC721Collection(c);

    _checkSignature(sig.signer, digest, sig.signature);
    _checkNonce(c.nonce);

    address owner = _msgSender();

    // addr = deploy(c.bytecode, abi.encode(c.name, c.symbol, c.royalty, c.baseTokenURI, c.batchSize, owner));
    addr = deploy2(c.bytecode, abi.encode(c.name, c.symbol, c.royalty, c.baseTokenURI, c.batchSize, owner), c.nonce);

    _erc721_collections.push(addr);

    emit ERC721CollectionDeployed(
      addr,
      c.name,
      c.symbol,
      c.royalty,
      c.baseTokenURI,
      c.featureIds,
      c.batchSize,
      owner
    );

    bytes32[] memory roles = new bytes32[](2);
    roles[0] = MINTER_ROLE;
    roles[1] = DEFAULT_ADMIN_ROLE;

    grantFactoryMintPermission(addr);
    grantFactoryMetadataPermission(addr);
    fixPermissions(addr, roles);
  }

  function _hashERC721Collection(Collection calldata c) internal view returns (bytes32) {
    return _hashTypedDataV4(keccak256(abi.encode(ERC721_COLLECTION_PERMIT_SIGNATURE, _hashCollectionStruct(c))));
  }

  function _hashCollectionStruct(Collection calldata c) private pure returns (bytes32) {
    return
      keccak256(
        abi.encode(
          COLLECTION_PARAMS_TYPEHASH,
          keccak256(abi.encodePacked(c.bytecode)),
          keccak256(abi.encodePacked(c.name)),
          keccak256(abi.encodePacked(c.symbol)),
          keccak256(abi.encodePacked(c.baseTokenURI)),
          keccak256(abi.encodePacked(c.featureIds)),
          c.royalty,
          c.batchSize,
          c.nonce
        )
      );
  }

  function allERC721Collections() external view returns (address[] memory) {
    return _erc721_collections;
  }
}
