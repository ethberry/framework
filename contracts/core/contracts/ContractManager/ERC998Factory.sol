// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "./AbstractFactory.sol";

contract ERC998Factory is AbstractFactory {
  bytes private constant ERC998_ARGUMENTS_SIGNATURE =
    "Erc998Args(string name,string symbol,uint96 royalty,string baseTokenURI,string contractTemplate)";
  bytes32 private constant ERC998_ARGUMENTS_TYPEHASH = keccak256(abi.encodePacked(ERC998_ARGUMENTS_SIGNATURE));

  bytes32 private immutable ERC998_PERMIT_SIGNATURE =
    keccak256(bytes.concat("EIP712(Params params,Erc998Args args)", ERC998_ARGUMENTS_SIGNATURE, PARAMS_SIGNATURE));

  address[] private _erc998_tokens;

  struct Erc998Args {
    string name;
    string symbol;
    uint96 royalty;
    string baseTokenURI;
    string contractTemplate;
  }

  event ERC998TokenDeployed(address addr, Erc998Args args);

  function deployERC998Token(
    Params calldata params,
    Erc998Args calldata args,
    bytes calldata signature
  ) external returns (address addr) {
    _checkNonce(params.nonce);

    address signer = _recoverSigner(_hashERC998(params, args), signature);
    require(hasRole(DEFAULT_ADMIN_ROLE, signer), "ContractManager: Wrong signer");

    addr = deploy2(params.bytecode, abi.encode(args.name, args.symbol, args.royalty, args.baseTokenURI), params.nonce);
    _erc998_tokens.push(addr);

    emit ERC998TokenDeployed(addr, args);

    bytes32[] memory roles = new bytes32[](2);
    roles[0] = MINTER_ROLE;
    roles[1] = DEFAULT_ADMIN_ROLE;

    grantFactoryMintPermission(addr);
    grantFactoryMetadataPermission(addr);
    fixPermissions(addr, roles);
  }

  function _hashERC998(Params calldata params, Erc998Args calldata args) internal view returns (bytes32) {
    return
      _hashTypedDataV4(
        keccak256(abi.encodePacked(ERC998_PERMIT_SIGNATURE, _hashParamsStruct(params), _hashErc998Struct(args)))
      );
  }

  function _hashErc998Struct(Erc998Args calldata args) private pure returns (bytes32) {
    return
      keccak256(
        abi.encode(
          ERC998_ARGUMENTS_TYPEHASH,
          keccak256(abi.encodePacked(args.name)),
          keccak256(abi.encodePacked(args.symbol)),
          args.royalty,
          keccak256(abi.encodePacked(args.baseTokenURI)),
          keccak256(abi.encodePacked(args.contractTemplate))
        )
      );
  }

  function allERC998Tokens() external view returns (address[] memory) {
    return _erc998_tokens;
  }
}
