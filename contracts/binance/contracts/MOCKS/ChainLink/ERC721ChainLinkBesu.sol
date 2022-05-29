// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity >=0.8.13;

import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

import "./ERC721ChainLinkTest.sol";

abstract contract ERC721ChainLinkBesu is ERC721ChainLinkTest {
  constructor()
  ERC721ChainLinkTest(
      address(0xc83003B2AD5C3EF3e93Cc3Ef0a48E84dc8DBD718), // vrfCoordinator
      address(0x6aA8b700cD034Ab4B897B59447f268b33B8cF699), // LINK token
      0xcaf3c3727e033261d383b315559476f48034c13b18f8cafed4d871abe5049186, // system hash
      0.1 ether // fee
    )
  {}
}
