// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "../../../Exchange/interfaces/IAsset.sol";

struct Raffle {
  address lotteryWallet;
  uint256 timeLagBeforeRelease;
  uint8 maxTickets;
  uint8 commission;
}
