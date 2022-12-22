// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;
import "hardhat/console.sol";
import "./AbstractFactory.sol";


contract ERC721CollectionFactory is AbstractFactory {

    bytes private constant COLLECTION_PARAMS = "Collection(bytes bytecode,string name,string symbol,string baseTokenURI,uint8[] featureIds,uint96 royalty,uint96 batchSize,bytes32 nonce)";
    bytes32 private constant COLLECTION_PARAMS_TYPEHASH = keccak256(abi.encodePacked(COLLECTION_PARAMS));

    bytes32 private immutable ERC721_COLLECTION_PERMIT_SIGNATURE =
    keccak256(
        bytes.concat("EIP712(Collection _c)", COLLECTION_PARAMS)
    );

    address[] private _erc721_collections;

    struct Signature {
        address signer;
        bytes signature;
    }

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
        Signature calldata _sig,
        Collection calldata _c
    ) external onlyRole(DEFAULT_ADMIN_ROLE) returns (address addr) {
        require(hasRole(DEFAULT_ADMIN_ROLE, _sig.signer), "ContractManager: Wrong signer");

        bytes32 digest = _hashERC721Collection(_c);
        console.logBytes32(digest);
        _checkSignature(_sig.signer, digest, _sig.signature);
        _checkNonce(_c.nonce);

        address owner = _msgSender();

        addr = deploy(_c.bytecode, abi.encode(_c.name, _c.symbol, _c.royalty, _c.baseTokenURI, _c.batchSize, owner));
        _erc721_collections.push(addr);

        emit ERC721CollectionDeployed(addr, _c.name, _c.symbol, _c.royalty, _c.baseTokenURI, _c.featureIds, _c.batchSize, owner);

        bytes32[] memory roles = new bytes32[](2);
        roles[0] = MINTER_ROLE;
        roles[1] = DEFAULT_ADMIN_ROLE;

        grantFactoryMintPermission(addr);
        grantFactoryMetadataPermission(addr);
        fixPermissions(addr, roles);
    }

    function _hashERC721Collection(
        Collection calldata _c
    ) internal view returns (bytes32) {
        return
        _hashTypedDataV4(
            keccak256(
                abi.encode(
                    ERC721_COLLECTION_PERMIT_SIGNATURE,
                    _hashCollectionStruct(_c)
                )
            )
        );
    }

    function _hashCollectionStruct(Collection calldata _c) private pure returns (bytes32) {
        return keccak256(abi.encode(COLLECTION_PARAMS_TYPEHASH, _c.bytecode, _c.name, _c.symbol, _c.baseTokenURI, _c.featureIds, _c.royalty, _c.batchSize, _c.nonce));
    }

    function allERC721Collections() external view returns (address[] memory) {
        return _erc721_collections;
    }
}
