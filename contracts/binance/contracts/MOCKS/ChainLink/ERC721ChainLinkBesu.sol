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
      address(0x5bC13f7Eeae521CDD95Cd000B92E586541cF68CE), // besu vrfCoordinator
      address(0xD218078f319c4569Cb1BEfA40a728F15Cef0313E), // besu LINK token
      0xcaf3c3727e033261d383b315559476f48034c13b18f8cafed4d871abe5049186, // system hash
      0.1 ether // fee
    )
  {}
}
