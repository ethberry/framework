// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@gemunion/contracts-chain-link/contracts/extensions/ChainLinkBaseV2.sol";

abstract contract ChainLinkBesuV2 is ChainLinkBaseV2 {
  constructor(
    uint64 subId,
    uint16 minReqConfs,
    uint32 callbackGasLimit,
    uint32 numWords
  )
    ChainLinkBaseV2(
      address(0xa50a51c09a5c451C52BB714527E1974b686D8e77), // vrfCoordinator
      0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311, // system hash
      subId,
      minReqConfs,
      callbackGasLimit,
      numWords
    )
  {}
}
