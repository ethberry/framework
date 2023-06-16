// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

interface ILottery {
  function printTicket(address account, bytes32 numbers) external returns (uint256 tokenId, uint256 roundId);

  function printTicket(address account) external returns (uint256 tokenId, uint256 roundId);
}
