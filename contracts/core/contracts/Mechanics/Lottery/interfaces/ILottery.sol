// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "../../../Exchange/interfaces/IAsset.sol";

struct Lottery {
  uint256 timeLagBeforeRelease;
  uint256 maxTickets;
  uint256 commission;
}

// TODO add more data?
struct RoundInfo {
  uint256 roundId;
  uint256 startTimestamp;
  uint256 endTimestamp;
  Asset acceptedAsset;
  Asset ticketAsset;
}

interface ILottery {
  function printTicket(address account, bytes32 numbers) external returns (uint256 tokenId, uint256 roundId);

  function getCurrentRoundInfo() external view returns (RoundInfo memory);
}
