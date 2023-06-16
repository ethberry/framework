// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

struct Ticket {
  uint256 round;
  bytes32 numbers;
  bool prize;
}

interface IERC721LotteryTicket {
  function mintTicket(address account, uint256 round, bytes32 numbers) external returns (uint256);

  function burn(uint256 tokenId) external;

  function getTicketData(uint256 tokenId) external view returns (Ticket memory);

  function setTicketData(uint256 tokenId) external;
}
