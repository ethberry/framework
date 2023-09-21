// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@gemunion/contracts-chain-link-v2/contracts/extensions/ChainLinkBinanceTestnetV2.sol";

import "../ERC721BlacklistDiscreteRentableRandom.sol";

/**
 * @dev An implementation of ERC721BlacklistDiscreteRentableRandom for Binance testnet
 */
contract ERC721BlacklistDiscreteRentableRandomBinanceTestnet is
  ERC721BlacklistDiscreteRentableRandom,
  ChainLinkBinanceTestnetV2
{
  constructor(
    string memory name,
    string memory symbol,
    uint96 royalty,
    string memory baseTokenURI
  )
    ERC721BlacklistDiscreteRentableRandom(name, symbol, royalty, baseTokenURI)
    ChainLinkBinanceTestnetV2(uint64(2778), uint16(3), uint32(700000), uint32(1))
  {}

  /**
   * @dev See {ERC721Random-getRandomNumber}.
   */
  function getRandomNumber()
    internal
    override(ChainLinkBaseV2, ERC721BlacklistDiscreteRentableRandom)
    returns (uint256 requestId)
  {
    return super.getRandomNumber();
  }

  /**
   * @dev See {ERC721Random-getRandomNumber}.
   */
  function fulfillRandomWords(
    uint256 requestId,
    uint256[] memory randomWords
  ) internal override(ERC721BlacklistDiscreteRentableRandom, VRFConsumerBaseV2) {
    return super.fulfillRandomWords(requestId, randomWords);
  }
}
