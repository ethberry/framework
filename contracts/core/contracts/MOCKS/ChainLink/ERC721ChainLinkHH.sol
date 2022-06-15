// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity >=0.8.13;

import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

import "./ERC721ChainLinkTest.sol";

abstract contract ERC721ChainLinkHH is ERC721ChainLinkTest {
  constructor()
  ERC721ChainLinkTest(
      address(0x8A791620dd6260079BF849Dc5567aDC3F2FdC318), // besu vrfCoordinator
      address(0xa513E6E4b8f2a923D98304ec87F64353C4D5C853), // besu LINK token
      0xcaf3c3727e033261d383b315559476f48034c13b18f8cafed4d871abe5049186, // system hash
      0.1 ether // fee
    )
  {}
}
//LINK_ADDR=0xa513e6e4b8f2a923d98304ec87f64353c4d5c853
//VRF_ADDR=0x8a791620dd6260079bf849dc5567adc3f2fdc318

