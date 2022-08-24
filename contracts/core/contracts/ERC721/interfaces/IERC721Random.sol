// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

interface IERC721Random {

  event MintRandom(bytes32 requestId, address to, uint256 randomness, uint256 templateId, uint256 tokenId);

  function mintRandom(address to, uint256 templateId) external;
}
