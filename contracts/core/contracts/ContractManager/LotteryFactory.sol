// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "../utils/errors.sol";
import "./AbstractFactory.sol";
import "../Mechanics/Lottery/interfaces/ILottery.sol";

contract LotteryFactory is AbstractFactory {
  bytes private constant LOTTERY_CONFIG_SIGNATURE = "LotteryConfig(uint256 timeLagBeforeRelease,uint256 commission)";
  bytes32 private constant LOTTERY_CONFIG_TYPEHASH = keccak256(LOTTERY_CONFIG_SIGNATURE);

  bytes private constant LOTTERY_ARGUMENTS_SIGNATURE = "LotteryArgs(LotteryConfig config)";
  bytes32 private constant LOTTERY_ARGUMENTS_TYPEHASH = keccak256(LOTTERY_ARGUMENTS_SIGNATURE);

  bytes32 private immutable LOTTERY_FULL_TYPEHASH =
    keccak256(bytes.concat(LOTTERY_ARGUMENTS_SIGNATURE, LOTTERY_CONFIG_SIGNATURE));

  bytes32 private immutable LOTTERY_PERMIT_SIGNATURE =
    keccak256(
      bytes.concat(
        "EIP712(Params params,LotteryArgs args)",
        LOTTERY_ARGUMENTS_SIGNATURE,
        LOTTERY_CONFIG_SIGNATURE,
        PARAMS_SIGNATURE
      )
    );

  address[] private _lotterys;

  struct LotteryArgs {
    LotteryConfig config;
  }

  event LotteryDeployed(address account, uint256 externalId, LotteryArgs args);

  function deployLottery(
    Params calldata params,
    LotteryArgs calldata args,
    bytes calldata signature
  ) external returns (address account) {
    _checkNonce(params.nonce);

    address signer = _recoverSigner(_hashLottery(params, args), signature);

    if (!hasRole(DEFAULT_ADMIN_ROLE, signer)) {
      revert SignerMissingRole();
    }

    account = deploy2(
      params.bytecode,
      abi.encodeWithSelector(bytes4(LOTTERY_CONFIG_TYPEHASH), args.config.timeLagBeforeRelease, args.config.commission),
      params.nonce
    );
    _lotterys.push(account);

    emit LotteryDeployed(account, params.externalId, args);

    bytes32[] memory roles = new bytes32[](2);
    roles[0] = PAUSER_ROLE;
    roles[1] = DEFAULT_ADMIN_ROLE;

    fixPermissions(account, roles);
  }

  function _hashLottery(Params calldata params, LotteryArgs calldata args) internal view returns (bytes32) {
    return
      _hashTypedDataV4(
        keccak256(abi.encodePacked(LOTTERY_PERMIT_SIGNATURE, _hashParamsStruct(params), _hashLotteryStruct(args)))
      );
  }

  function _hashLotteryStruct(LotteryArgs calldata args) private view returns (bytes32) {
    return keccak256(abi.encode(LOTTERY_FULL_TYPEHASH, _hashLotteryConfigStruct(args.config)));
  }

  function _hashLotteryConfigStruct(LotteryConfig calldata config) private pure returns (bytes32) {
    return keccak256(abi.encode(LOTTERY_CONFIG_TYPEHASH, config.timeLagBeforeRelease, config.commission));
  }

  function allLotterys() external view returns (address[] memory) {
    return _lotterys;
  }
}