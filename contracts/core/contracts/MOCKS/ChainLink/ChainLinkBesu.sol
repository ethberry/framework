// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

import "./ChainLinkTest.sol";

abstract contract ChainLinkBesu is ChainLinkTest {
  constructor()
    ChainLinkTest(
      address(0x3Ace09BBA3b8507681146252d3Dd33cD4E2d4F63), // vrfCoordinator
      address(0xBF921f94Fd9eF1738bE25D8CeCFDFE2C822c81B0), // LINK token
      0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311, // system hash
      0.1 ether // fee
    )
  {}
}
//LINK_ADDR=0xBF921f94Fd9eF1738bE25D8CeCFDFE2C822c81B0
//VRF_ADDR=0x3Ace09BBA3b8507681146252d3Dd33cD4E2d4F63
