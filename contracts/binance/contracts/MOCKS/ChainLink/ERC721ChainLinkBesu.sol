// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.4;

import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

import "./ERC721ChainLinkTest.sol";

abstract contract ERC721ChainLinkBesu is ERC721ChainLinkTest {
  constructor()
  ERC721ChainLinkTest(
      address(0xa50a51c09a5c451C52BB714527E1974b686D8e77), // vrfCoordinator
      address(0x42699A7612A82f1d9C36148af9C77354759b210b), // LINK token
      0xcaf3c3727e033261d383b315559476f48034c13b18f8cafed4d871abe5049186, // system hash
      0.1 ether // fee
    )
  {}
}
