// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "../../../Exchange/interfaces/IAsset.sol";

struct Raffle {
  uint256 timeLagBeforeRelease;
  uint256 commission;
}

// TODO add more data?
struct RoundInfo {
  uint256 roundId;
  uint256 startTimestamp;
  uint256 endTimestamp;
  uint256 maxTicket;
  Asset acceptedAsset;
  Asset ticketAsset;
}
