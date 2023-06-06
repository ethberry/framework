// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/utils/Counters.sol";

import "@gemunion/contracts-erc721/contracts/extensions/ERC721ABaseUrl.sol";
import "@gemunion/contracts-erc721e/contracts/preset/ERC721ABER.sol";

import "./interfaces/IERC721LotteryTicket.sol";

contract ERC721LotteryTicket is IERC721LotteryTicket, ERC721ABER, ERC721ABaseUrl {
  using Counters for Counters.Counter;

  mapping(uint256 => Ticket) private _data;

  constructor(
    string memory name,
    string memory symbol,
    uint96 royalty,
    string memory baseTokenURI
  ) ERC721ABER(name, symbol, royalty) ERC721ABaseUrl(baseTokenURI) {
    _tokenIdTracker.increment();
  }

  // TICKET

  function mintTicket(
    address account,
    uint256 round,
    bytes32 numbers
  ) external onlyRole(MINTER_ROLE) returns (uint256 tokenId) {
    tokenId = _tokenIdTracker.current();
    _tokenIdTracker.increment();

    _data[tokenId] = Ticket(round, numbers);

    _safeMint(account, tokenId);
  }

  function getTicketData(uint256 tokenId) external view returns (Ticket memory) {
    require(_exists(tokenId), "ERC721Lottery: invalid token ID");
    return _data[tokenId];
  }

  function burn(uint256 tokenId) public override(ERC721Burnable, IERC721LotteryTicket) {
    super.burn(tokenId);
  }

  // BASE URL

  function _baseURI() internal view virtual override(ERC721, ERC721ABaseUrl) returns (string memory) {
    return _baseURI(_baseTokenURI);
  }

  // COMMON

  function supportsInterface(
    bytes4 interfaceId
  ) public view virtual override(AccessControl, ERC721ABER) returns (bool) {
    return interfaceId == type(IERC721LotteryTicket).interfaceId || super.supportsInterface(interfaceId);
  }
}
