// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "./AbstractFactory.sol";

contract ERC20Factory is AbstractFactory {
  bytes private constant ERC20_PARAMS =
  "Erc20(bytes bytecode,string name,string symbol,uint256 cap,uint8[] featureIds,bytes32 nonce)";
  bytes32 private constant ERC20_PARAMS_TYPEHASH = keccak256(abi.encodePacked(ERC20_PARAMS));

  bytes32 private immutable ERC20_PERMIT_SIGNATURE =
  keccak256(bytes.concat("EIP712(Erc20 c)", ERC20_PARAMS));

  address[] private _erc20_tokens;

  struct Erc20 {
    bytes bytecode;
    string name;
    string symbol;
    uint256 cap;
    uint8[] featureIds;
    bytes32 nonce;
  }

  event ERC20TokenDeployed(address addr, string name, string symbol, uint256 cap, uint8[] featureIds);

  function deployERC20Token(
    Signature calldata sig,
    Erc20 calldata c
  ) external onlyRole(DEFAULT_ADMIN_ROLE) returns (address addr) {
    require(hasRole(DEFAULT_ADMIN_ROLE, sig.signer), "ContractManager: Wrong signer");

    bytes32 digest = _hashERC20(c);

    _checkSignature(sig.signer, digest, sig.signature);
    _checkNonce(c.nonce);

//    addr = deploy(bytecode, abi.encode(name, symbol, cap));
    addr = deploy2(c.bytecode, abi.encode(c.name, c.symbol, c.cap), c.nonce);
    _erc20_tokens.push(addr);

    emit ERC20TokenDeployed(addr, c.name, c.symbol, c.cap, c.featureIds);

    bytes32[] memory roles = new bytes32[](3);
    roles[0] = MINTER_ROLE;
    roles[1] = SNAPSHOT_ROLE;
    roles[2] = DEFAULT_ADMIN_ROLE;

    grantFactoryMintPermission(addr);
    fixPermissions(addr, roles);
  }

  function _hashERC20(Erc20 calldata c) internal view returns (bytes32) {
    return _hashTypedDataV4(keccak256(abi.encode(ERC20_PERMIT_SIGNATURE, _hashErc20Struct(c))));
  }
//"Erc20(bytes bytecode,string name,string symbol,uint256 cap,uint8[] featureIds,bytes32 nonce)";

  function _hashErc20Struct(Erc20 calldata c) private pure returns (bytes32) {
    return
    keccak256(
      abi.encode(
        ERC20_PARAMS_TYPEHASH,
        keccak256(abi.encodePacked(c.bytecode)),
        keccak256(abi.encodePacked(c.name)),
        keccak256(abi.encodePacked(c.symbol)),
        c.cap,
        keccak256(abi.encodePacked(c.featureIds)),
        c.nonce
      )
    );
  }
  function allERC20Tokens() external view returns (address[] memory) {
    return _erc20_tokens;
  }
}
