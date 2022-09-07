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
      address(0x9271670cFFdA6e695731b3FC2332Bf890D98856D), // vrfCoordinator
      address(0x91483855a65211E3A3362ED1Fa42A388280805Be), // LINK token
      0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311, // system hash
      0.1 ether // fee
    )
  {}
}
