// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+undeads@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.4;

interface IDropboxERC721 {
  function mintDropbox(address to, uint256 templateId) external returns (uint256);
}
