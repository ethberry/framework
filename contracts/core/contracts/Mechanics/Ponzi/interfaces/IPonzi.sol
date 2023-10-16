// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.20;
import "../../../Exchange/lib/interfaces/IAsset.sol";

interface IPonzi {
  struct Rule {
    Asset deposit;
    Asset reward;
    uint256 period;
    uint256 maxCycles;
    uint256 penalty;
    uint256 externalId;
//    uint256 maxDeposit;
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
