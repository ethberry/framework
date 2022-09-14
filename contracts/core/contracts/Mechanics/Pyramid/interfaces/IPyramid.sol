// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

  enum TokenType {
    // 0: ETH on mainnet, MATIC on polygon, etc.
    NATIVE,
    // 1: ERC20 items (ERC777 and other ERC20 analogues could technically work)
    ERC20
  }

  struct Asset {
    TokenType tokenType;
    address token;
    uint256 amount;
  }

interface IPyramid {

  struct Rule {
    Asset deposit;
    Asset reward;
    uint256 period;
    uint256 penalty;
    uint256 externalId;
    bool recurrent;
    bool active;
  }

  struct Stake {
    address owner;
    Asset deposit;
    uint256 ruleId;
    uint256 startTimestamp;
    uint256 cycles;
    bool activeDeposit;
  }

  event RuleCreated(uint256 ruleId, Rule rule, uint256 externalId);
  event RuleUpdated(uint256 ruleId, bool active);
}
