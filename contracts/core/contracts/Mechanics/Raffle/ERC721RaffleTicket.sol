// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/utils/Counters.sol";

import "@gemunion/contracts-erc721/contracts/extensions/ERC721ABaseUrl.sol";
import "@gemunion/contracts-erc721/contracts/extensions/ERC721AMetaDataGetter.sol";
import "@gemunion/contracts-erc721e/contracts/preset/ERC721ABER.sol";

import "./interfaces/IERC721RaffleTicket.sol";
import "../../utils/errors.sol";

contract ERC721RaffleTicket is IERC721RaffleTicket, ERC721ABER, ERC721ABaseUrl, ERC721AMetaDataGetter {
  using Counters for Counters.Counter;

  mapping(uint256 => TicketRaffle) private _data;

  bytes32 constant ROUND = keccak256("ROUND");
  bytes32 constant PRIZE = keccak256("PRIZE");

  constructor(
    string memory name,
    string memory symbol,
    uint96 royalty,
    string memory baseTokenURI
  ) ERC721ABER(name, symbol, royalty) ERC721ABaseUrl(baseTokenURI) {
    _tokenIdTracker.increment();
  }

  // TICKET

  function mintTicket(address account, uint256 round) external onlyRole(MINTER_ROLE) returns (uint256 tokenId) {
    tokenId = _tokenIdTracker.current();
    _tokenIdTracker.increment();

    _data[tokenId] = TicketRaffle(round, false);

    _upsertRecordField(tokenId, ROUND, round);

    _safeMint(account, tokenId);
  }

  function burn(uint256 tokenId) public override(ERC721Burnable, IERC721RaffleTicket) {
    super.burn(tokenId);
  }

  function getTicketData(uint256 tokenId) external view returns (TicketRaffle memory) {
    if (!_exists(tokenId)) {
      revert WrongToken();
    }
    return _data[tokenId];
  }

  function setTicketData(uint256 tokenId) external onlyRole(MINTER_ROLE) {
    if (!_exists(tokenId)) {
      revert WrongToken();
    }
    _data[tokenId].prize = true;
    _upsertRecordField(tokenId, PRIZE, 1);
  }

  // BASE URL

  function _baseURI() internal view virtual override(ERC721, ERC721ABaseUrl) returns (string memory) {
    return _baseURI(_baseTokenURI);
  }

  // COMMON

  function supportsInterface(
    bytes4 interfaceId
  ) public view virtual override(AccessControl, ERC721ABER) returns (bool) {
    return interfaceId == type(IERC721RaffleTicket).interfaceId || super.supportsInterface(interfaceId);
  }
}
