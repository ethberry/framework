// SPDX-License-Identifier: UNLICENSED
// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/
pragma solidity ^0.8.13;
import "hardhat/console.sol";
import "./errors.sol";
contract ErrorsIdCalculator { constructor() {}
  receive() external payable virtual {
    revert MethodNotSupported();
    revert TemplateZero();
    revert UnsupportedTokenType();
    revert SignerMissingRole();
    revert ExpiredSignature();
    revert NotExist();
    revert NotAnOwner();
    revert CountExceed();
    revert LimitExceed();
    revert BalanceExceed();
    revert WrongAmount();
    revert RefProgramSet();
    revert WrongToken();
    revert WrongStake();
    revert WrongRule();
    revert Expired();
    revert ZeroBalance();
    revert NotComplete();
    revert NotActive();
  }
}
