// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "./AbstractFactory.sol";

contract ERC1155Factory is AbstractFactory {
  bytes private constant ERC1155_ARGUMENTS_SIGNATURE =
    "Erc1155Args(uint96 royalty,string baseTokenURI,uint8[] featureIds)";
  bytes32 private constant ERC1155_ARGUMENTS_TYPEHASH = keccak256(abi.encodePacked(ERC1155_ARGUMENTS_SIGNATURE));

  bytes32 private immutable ERC1155_PERMIT_SIGNATURE =
    keccak256(bytes.concat("EIP712(Params params,Erc1155Args args)", ERC1155_ARGUMENTS_SIGNATURE, PARAMS_SIGNATURE));

  address[] private _erc1155_tokens;

  struct Erc1155Args {
    uint96 royalty;
    string baseTokenURI;
    uint8[] featureIds;
  }

  event ERC1155TokenDeployed(address addr, Erc1155Args args);

  function deployERC1155Token(
    Params calldata params,
    Erc1155Args calldata args,
    bytes calldata signature
  ) external onlyRole(DEFAULT_ADMIN_ROLE) returns (address addr) {
    _checkNonce(params.nonce);

    require(
      hasRole(DEFAULT_ADMIN_ROLE, _recoverSigner(_hashERC1155(params, args), signature)),
      "ContractManager: Wrong signer"
    );

    addr = deploy2(params.bytecode, abi.encode(args.royalty, args.baseTokenURI), params.nonce);
    _erc1155_tokens.push(addr);

    emit ERC1155TokenDeployed(addr, args);

    bytes32[] memory roles = new bytes32[](2);
    roles[0] = MINTER_ROLE;
    roles[1] = DEFAULT_ADMIN_ROLE;

    grantFactoryMintPermission(addr);
    fixPermissions(addr, roles);
  }

  function _hashERC1155(Params calldata params, Erc1155Args calldata args) internal view returns (bytes32) {
    return
      _hashTypedDataV4(
        keccak256(abi.encode(ERC1155_PERMIT_SIGNATURE, _hashParamsStruct(params), _hashErc1155Struct(args)))
      );
  }

  function _hashErc1155Struct(Erc1155Args calldata args) private pure returns (bytes32) {
    return
      keccak256(
        abi.encode(
          ERC1155_ARGUMENTS_TYPEHASH,
          args.royalty,
          keccak256(abi.encodePacked(args.baseTokenURI)),
          keccak256(abi.encodePacked(args.featureIds))
        )
      );
  }

  function allERC1155Tokens() external view returns (address[] memory) {
    return _erc1155_tokens;
  }
}
