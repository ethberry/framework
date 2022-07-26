// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

import "./ERC721ChainLinkTest.sol";

abstract contract ERC721ChainLinkHardhat is ERC721ChainLinkTest {
  constructor()
    ERC721ChainLinkTest(
      address(0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0), // besu vrfCoordinator
      address(0x5FbDB2315678afecb367f032d93F642f64180aa3), // besu LINK token
      0xcaf3c3727e033261d383b315559476f48034c13b18f8cafed4d871abe5049186, // system hash
      0.1 ether // fee
    )
  {}
}

