// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;
import "./AbstractFactory.sol";

contract CollectionFactory is AbstractFactory {
  bytes private constant ERC721C_ARGUMENTS_SIGNATURE =
    "CollectionArgs(string name,string symbol,uint96 royalty,string baseTokenURI,uint96 batchSize,string contractTemplate)";
  bytes32 private constant ERC721C_ARGUMENTS_TYPEHASH = keccak256(abi.encodePacked(ERC721C_ARGUMENTS_SIGNATURE));

  bytes32 private immutable ERC721C_PERMIT_SIGNATURE =
    keccak256(bytes.concat("EIP712(Params params,CollectionArgs args)", ERC721C_ARGUMENTS_SIGNATURE, PARAMS_SIGNATURE));

  address[] private _erc721c_token;

  struct CollectionArgs {
    string name;
    string symbol;
    uint96 royalty;
    string baseTokenURI;
    uint96 batchSize;
    string contractTemplate;
  }

  event CollectionDeployed(address addr, CollectionArgs args, address owner);

  function deployCollection(
    Params calldata params,
    CollectionArgs calldata args,
    bytes calldata signature
  ) external onlyRole(DEFAULT_ADMIN_ROLE) returns (address addr) {
    _checkNonce(params.nonce);

    address signer = _recoverSigner(_hashCollection(params, args), signature);
    require(hasRole(DEFAULT_ADMIN_ROLE, signer), "ContractManager: Wrong signer");

    addr = deploy2(
      params.bytecode,
      abi.encode(args.name, args.symbol, args.royalty, args.baseTokenURI, args.batchSize, _msgSender()),
      params.nonce
    );
    _erc721c_token.push(addr);

    emit CollectionDeployed(addr, args, _msgSender());

    bytes32[] memory roles = new bytes32[](2);
    roles[0] = MINTER_ROLE;
    roles[1] = DEFAULT_ADMIN_ROLE;

    grantFactoryMintPermission(addr);
    grantFactoryMetadataPermission(addr);
    fixPermissions(addr, roles);
  }

  function _hashCollection(Params calldata params, CollectionArgs calldata args) internal view returns (bytes32) {
    return
      _hashTypedDataV4(
        keccak256(abi.encode(ERC721C_PERMIT_SIGNATURE, _hashParamsStruct(params), _hashErc721CStruct(args)))
      );
  }

  function _hashErc721CStruct(CollectionArgs calldata args) private pure returns (bytes32) {
    return
      keccak256(
        abi.encode(
          ERC721C_ARGUMENTS_TYPEHASH,
          keccak256(abi.encodePacked(args.name)),
          keccak256(abi.encodePacked(args.symbol)),
          args.royalty,
          keccak256(abi.encodePacked(args.baseTokenURI)),
          args.batchSize,
          keccak256(abi.encodePacked(args.contractTemplate))
        )
      );
  }

  function allCollections() external view returns (address[] memory) {
    return _erc721c_token;
  }
}
