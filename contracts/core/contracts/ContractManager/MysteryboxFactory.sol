// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "./AbstractFactory.sol";

contract MysteryboxFactory is AbstractFactory {
  bytes private constant MYSTERYBOX_ARGUMENTS_SIGNATURE =
    "MysteryArgs(string name,string symbol,uint96 royalty,string baseTokenURI,uint8[] featureIds)";
  bytes32 private constant MYSTERYBOX_ARGUMENTS_TYPEHASH = keccak256(abi.encodePacked(MYSTERYBOX_ARGUMENTS_SIGNATURE));

  bytes32 private immutable MYSTERYBOX_PERMIT_SIGNATURE =
    keccak256(bytes.concat("EIP712(Params params,MysteryArgs args)", MYSTERYBOX_ARGUMENTS_SIGNATURE, PARAMS_SIGNATURE));

  address[] private _mysterybox_tokens;

  struct MysteryArgs {
    string name;
    string symbol;
    uint96 royalty;
    string baseTokenURI;
    uint8[] featureIds;
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
    Params calldata params,
    MysteryArgs calldata args,
    bytes calldata signature
  ) external onlyRole(DEFAULT_ADMIN_ROLE) returns (address addr) {
    _checkNonce(params.nonce);

    require(
      hasRole(DEFAULT_ADMIN_ROLE, _recoverSigner(_hashMysterybox(params, args), signature)),
      "ContractManager: Wrong signer"
    );

    addr = deploy2(params.bytecode, abi.encode(args.name, args.symbol, args.royalty, args.baseTokenURI), params.nonce);
    _mysterybox_tokens.push(addr);

    emit MysteryboxDeployed(addr, args.name, args.symbol, args.royalty, args.baseTokenURI, args.featureIds);

    bytes32[] memory roles = new bytes32[](2);
    roles[0] = MINTER_ROLE;
    roles[1] = DEFAULT_ADMIN_ROLE;

    grantFactoryMintPermission(addr);
    grantFactoryMetadataPermission(addr);
    fixPermissions(addr, roles);
    addFactory(addr, MINTER_ROLE);
  }

  function _hashMysterybox(Params calldata params, MysteryArgs calldata args) internal view returns (bytes32) {
    return
      _hashTypedDataV4(
        keccak256(abi.encode(MYSTERYBOX_PERMIT_SIGNATURE, _hashParamsStruct(params), _hashMysteryStruct(args)))
      );
  }

  function _hashMysteryStruct(MysteryArgs calldata args) private pure returns (bytes32) {
    return
      keccak256(
        abi.encode(
          MYSTERYBOX_ARGUMENTS_TYPEHASH,
          keccak256(abi.encodePacked(args.name)),
          keccak256(abi.encodePacked(args.symbol)),
          args.royalty,
          keccak256(abi.encodePacked(args.baseTokenURI)),
          keccak256(abi.encodePacked(args.featureIds))
        )
      );
  }

  function allMysteryboxes() external view returns (address[] memory) {
    return _mysterybox_tokens;
  }
}
