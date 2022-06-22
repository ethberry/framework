// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

interface IERC721Royalty {
  function setDefaultRoyalty(address royaltyReceiver, uint96 royalty) external;
  function setTokenRoyalty(uint256 tokenId, address royaltyReceiver, uint96 royalty) external;
}
