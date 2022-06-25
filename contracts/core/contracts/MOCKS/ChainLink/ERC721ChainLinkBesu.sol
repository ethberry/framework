// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

import "./ERC721ChainLinkTest.sol";

abstract contract ERC721ChainLinkBesu is ERC721ChainLinkTest {
  constructor()
  ERC721ChainLinkTest(
      address(0xBF921f94Fd9eF1738bE25D8CeCFDFE2C822c81B0), // besu vrfCoordinator
      address(0xd6A7c915066E17ba18024c799258C8A286fFBc00), // besu LINK token
      0xcaf3c3727e033261d383b315559476f48034c13b18f8cafed4d871abe5049186, // system hash
      0.1 ether // fee
    )
  {}
}
