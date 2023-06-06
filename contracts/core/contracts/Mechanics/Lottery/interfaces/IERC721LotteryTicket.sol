// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

struct Ticket {
  uint256 round;
  bool[36] numbers;
}

interface IERC721LotteryTicket {
  function mintTicket(address account, uint256 round, bool[36] calldata numbers) external returns (uint256);

  function burn(uint256 tokenId) external;

  function getTicketData(uint256 tokenId) external view returns (Ticket memory);
}
