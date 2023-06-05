// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

struct Lottery {
  address lotteryWallet;
  uint256 timeLagBeforeRelease;
  uint8 maxTickets;
  uint8 commission;
}
