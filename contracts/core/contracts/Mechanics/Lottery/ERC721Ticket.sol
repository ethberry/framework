// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Counters.sol";

import "@gemunion/contracts/contracts/ERC721/ERC721ACBaseUrl.sol";
import "@gemunion/contracts/contracts/ERC721/preset/ERC721ACBER.sol";

import "./interfaces/IERC721Ticket.sol";

contract ERC721Ticket is IERC721Ticket, ERC721ACBER, ERC721ACBaseUrl {
  using Counters for Counters.Counter;

  mapping(uint256 => Ticket) private _data;

  constructor(
    string memory name,
    string memory symbol,
    uint96 royalty,
    string memory baseTokenURI
  ) ERC721ACBER(name, symbol, royalty) ERC721ACBaseUrl(baseTokenURI) {
    _tokenIdTracker.increment();
  }

  // TICKET

  function mintTicket(
    address account,
    uint256 round,
    bool[36] calldata numbers
  ) external onlyRole(MINTER_ROLE) returns (uint256 tokenId) {
    tokenId = _tokenIdTracker.current();
    _tokenIdTracker.increment();

    _data[tokenId] = Ticket(round, numbers);

    _safeMint(account, tokenId);
  }

  function getTicketData(uint256 tokenId) external view returns (Ticket memory) {
    require(_exists(tokenId), "ERC721Ticket: invalid token ID");
    return _data[tokenId];
  }

  function burn(uint256 tokenId) public override (ERC721Burnable, IERC721Ticket) {
    super.burn(tokenId);
  }

  // BASE URL

  function _baseURI() internal view virtual override(ERC721, ERC721ACBaseUrl) returns (string memory) {
    return _baseURI(_baseTokenURI);
  }

  // COMMON

  function supportsInterface(bytes4 interfaceId)
    public
    view
    virtual
    override(AccessControl, ERC721ACBER)
    returns (bool)
  {
    return super.supportsInterface(interfaceId);
  }
}
