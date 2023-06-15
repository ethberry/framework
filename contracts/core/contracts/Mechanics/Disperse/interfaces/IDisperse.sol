// SPDX-License-Identifier: UNLICENSED

/**
 *Submitted for verification at BscScan.com on 2020-09-14
 */

pragma solidity ^0.8.13;

import "../../../Exchange/interfaces/IAsset.sol";

interface IDisperse {
  function disperse(Asset[] memory items, address[] calldata receivers) external payable;
}
