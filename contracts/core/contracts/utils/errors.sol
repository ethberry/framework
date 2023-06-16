// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

error MethodNotSupported();
error TemplateZero();
error UnsupportedTokenType();

error SignerMissingRole();
error ExpiredSignature();
error NotExist();
error NotAnOwner();
error CountExceed();
error LimitExceed();
error BalanceExceed();
error WrongAmount();
error RefProgramSet();
error WrongArrayLength();

// staking
error WrongToken();
error WrongStake();
error WrongRule();
error Expired();
error ZeroBalance();
error NotComplete();
error NotActive();

// lottery, raffle
error WrongRound();
error WrongPrice();
