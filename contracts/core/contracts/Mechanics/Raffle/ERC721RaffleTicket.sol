// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.20;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {ERC721Burnable} from  "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";

import "@gemunion/contracts-erc721/contracts/extensions/ERC721ABaseUrl.sol";
import "@gemunion/contracts-erc721e/contracts/preset/ERC721ABER.sol";

import "../../ERC721/extensions/ERC721GeneralizedCollection.sol";
import "../../utils/errors.sol";
import "../../utils/constants.sol";
import "./interfaces/IERC721RaffleTicket.sol";

contract ERC721RaffleTicket is IERC721RaffleTicket, ERC721ABER, ERC721ABaseUrl, ERC721GeneralizedCollection {
  mapping(uint256 => TicketRaffle) private _data;

  constructor(
    string memory name,
    string memory symbol,
    uint96 royalty,
    string memory baseTokenURI
  ) ERC721ABER(name, symbol, royalty) ERC721ABaseUrl(baseTokenURI) {
    _nextTokenId++;
  }

  // TICKET

  function mintTicket(
    address account,
    uint256 roundId,
    uint256 externalId
  ) external onlyRole(MINTER_ROLE) returns (uint256) {
    _data[_nextTokenId] = TicketRaffle(roundId, externalId, false);

    _upsertRecordField(_nextTokenId, ROUND, externalId);

    _safeMint(account, _nextTokenId);

    return _nextTokenId++;
  }

  /**
   * @dev Burns `tokenId`. See {ERC721-_burn}.
   *
   * Requirements:
   *
   * - The caller must own `tokenId` or be an approved operator.
   */
  function burn(uint256 tokenId) public override(ERC721Burnable, IERC721RaffleTicket) {
    super.burn(tokenId);
  }

  function getTicketData(uint256 tokenId) external view returns (TicketRaffle memory) {
    _requireOwned(tokenId);
    return _data[tokenId];
  }

  function setPrize(uint256 tokenId, uint256 multiplier) external onlyRole(MINTER_ROLE) {
    _requireOwned(tokenId);
    // TODO use only metadata as storage?
    _data[tokenId].prize = true;
    _upsertRecordField(tokenId, PRIZE, multiplier);
  }

  // BASE URL

  function _baseURI() internal view virtual override(ERC721, ERC721ABaseUrl) returns (string memory) {
    return _baseURI(_baseTokenURI);
  }

  /**
   * @dev See {IERC165-supportsInterface}.
   */
  function supportsInterface(
    bytes4 interfaceId
  ) public view virtual override(AccessControl, ERC721ABER) returns (bool) {
    return interfaceId == type(IERC721RaffleTicket).interfaceId || super.supportsInterface(interfaceId);
  }
}
