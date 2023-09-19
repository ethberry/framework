// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "hardhat/console.sol";

import "../../ERC721/interfaces/IERC721Simple.sol";
import "../../ERC721/interfaces/IERC721Discrete.sol";
import "../../ERC721/interfaces/IERC721Random.sol";

import "../../Mechanics/MysteryBox/interfaces/IERC721MysteryBox.sol";
import "../../Mechanics/Dispenser/interfaces/IDispenser.sol";
import "../../Mechanics/Lottery/interfaces/IERC721LotteryTicket.sol";
import "../../Mechanics/Raffle/interfaces/IERC721RaffleTicket.sol";

contract InterfaceIdCalculator {
  function test() public view {
    console.logBytes4(type(IERC721Simple).interfaceId);
    console.logBytes4(type(IERC721Discrete).interfaceId);
    console.logBytes4(type(IERC721Random).interfaceId);

    console.logBytes4(type(IERC721MysteryBox).interfaceId);
    console.logBytes4(type(IERC721LotteryTicket).interfaceId);
    console.logBytes4(type(IERC721RaffleTicket).interfaceId);

    console.logBytes4(type(IDispenser).interfaceId);
  }
}
