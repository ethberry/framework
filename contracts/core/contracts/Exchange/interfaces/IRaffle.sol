// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

interface IRaffle {
  function printTicket(address account) external returns (uint256 tokenId, uint256 roundId);
}
