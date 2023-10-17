// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.20;

import "hardhat/console.sol";

import "../../ERC721/interfaces/IERC721Simple.sol";
import "../../ERC721/interfaces/IERC721Discrete.sol";
import "../../ERC721/interfaces/IERC721Random.sol";

import "../../Mechanics/MysteryBox/interfaces/IERC721MysteryBox.sol";
import "../../Mechanics/Dispenser/interfaces/IDispenser.sol";
import "../../Mechanics/Lottery/interfaces/IERC721LotteryTicket.sol";
import "../../Mechanics/Raffle/interfaces/IERC721RaffleTicket.sol";

contract InterfaceIdCalculator {
  function test() public pure {
    console.logString("IERC721Simple");
    console.logBytes4(type(IERC721Simple).interfaceId);
    console.logString("IERC721Discrete");
    console.logBytes4(type(IERC721Discrete).interfaceId);
    console.logString("IERC721Random");
    console.logBytes4(type(IERC721Random).interfaceId);

    console.logString("IERC721MysteryBox");
    console.logBytes4(type(IERC721MysteryBox).interfaceId);
    console.logString("IERC721LotteryTicket");
    console.logBytes4(type(IERC721LotteryTicket).interfaceId);
    console.logString("IERC721RaffleTicket");
    console.logBytes4(type(IERC721RaffleTicket).interfaceId);
    console.logString("IDispenser");
    console.logBytes4(type(IDispenser).interfaceId);
  }
}
