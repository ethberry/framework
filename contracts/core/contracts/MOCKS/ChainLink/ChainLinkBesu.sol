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
      address(0xcA57398e94aBb2192FdF7E0f97BEFAe78EBF50B8), // vrfCoordinator
      address(0x121374c9C4bef50C3886B01E6e5816af0CCD401e), // LINK token
      0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311, // system hash
      0.1 ether // fee
    )
  {}
}
//LINK_ADDR=0x121374c9C4bef50C3886B01E6e5816af0CCD401e
//VRF_ADDR=0xcA57398e94aBb2192FdF7E0f97BEFAe78EBF50B8
