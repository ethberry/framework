// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

struct TicketRaffle {
  uint256 round;
}

interface IERC721RaffleTicket {
  function mintTicket(address account, uint256 round) external returns (uint256);

  function burn(uint256 tokenId) external;

  function getTicketData(uint256 tokenId) external view returns (TicketRaffle memory);
}
