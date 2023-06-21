// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "../utils/errors.sol";
import "./AbstractFactory.sol";
import "../Mechanics/Raffle/interfaces/IRaffle.sol";

contract RaffleFactory is AbstractFactory {
  bytes private constant RAFFLE_CONFIG_SIGNATURE = "RaffleConfig(uint256 timeLagBeforeRelease,uint256 commission)";
  bytes32 private constant RAFFLE_CONFIG_TYPEHASH = keccak256(RAFFLE_CONFIG_SIGNATURE);

  bytes private constant RAFFLE_ARGUMENTS_SIGNATURE = "RaffleArgs(RaffleConfig config)";
  bytes32 private constant RAFFLE_ARGUMENTS_TYPEHASH = keccak256(RAFFLE_ARGUMENTS_SIGNATURE);

  bytes32 private immutable RAFFLE_FULL_TYPEHASH =
    keccak256(bytes.concat(RAFFLE_ARGUMENTS_SIGNATURE, RAFFLE_CONFIG_SIGNATURE));

  bytes32 private immutable RAFFLE_PERMIT_SIGNATURE =
    keccak256(
      bytes.concat(
        "EIP712(Params params,RaffleArgs args)",
        PARAMS_SIGNATURE,
        RAFFLE_ARGUMENTS_SIGNATURE,
        RAFFLE_CONFIG_SIGNATURE
      )
    );

  address[] private _raffles;

  struct RaffleArgs {
    RaffleConfig config;
  }

  event RaffleDeployed(address addr, RaffleArgs args);

  function deployRaffle(
    Params calldata params,
    RaffleArgs calldata args,
    bytes calldata signature
  ) external returns (address addr) {
    _checkNonce(params.nonce);

    address signer = _recoverSigner(_hashRaffle(params, args), signature);

    if (!hasRole(DEFAULT_ADMIN_ROLE, signer)) {
      revert SignerMissingRole();
    }

    addr = deploy2(
      params.bytecode,
      abi.encodeWithSelector(bytes4(RAFFLE_CONFIG_TYPEHASH), args.config.timeLagBeforeRelease, args.config.commission),
      params.nonce
    );
    _raffles.push(addr);

    emit RaffleDeployed(addr, args);

    bytes32[] memory roles = new bytes32[](2);
    roles[0] = PAUSER_ROLE;
    roles[1] = DEFAULT_ADMIN_ROLE;

    fixPermissions(addr, roles);
  }

  function _hashRaffle(Params calldata params, RaffleArgs calldata args) internal view returns (bytes32) {
    return
      _hashTypedDataV4(
        keccak256(abi.encodePacked(RAFFLE_PERMIT_SIGNATURE, _hashParamsStruct(params), _hashRaffleStruct(args)))
      );
  }

  function _hashRaffleStruct(RaffleArgs calldata args) private view returns (bytes32) {
    return keccak256(abi.encode(RAFFLE_FULL_TYPEHASH, _hashRaffleConfigStruct(args.config)));
  }

  function _hashRaffleConfigStruct(RaffleConfig calldata config) private pure returns (bytes32) {
    return keccak256(abi.encode(RAFFLE_CONFIG_TYPEHASH, config.timeLagBeforeRelease, config.commission));
  }

  function allRaffles() external view returns (address[] memory) {
    return _raffles;
  }
}
