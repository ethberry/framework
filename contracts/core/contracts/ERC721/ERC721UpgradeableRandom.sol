// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/utils/Counters.sol";

// import "@gemunion/contracts-chain-link/contracts/extensions/ChainLinkBinance.sol";
import "@gemunion/contracts-chain-link/contracts/extensions/ChainLinkGoerli.sol";

import "./ERC721Upgradeable.sol";
import "./interfaces/IERC721Random.sol";
import "../Mechanics/Rarity/Rarity.sol";

contract ERC721UpgradeableRandom is IERC721Random, ChainLinkGoerli, ERC721Upgradeable, Rarity {
  using Counters for Counters.Counter;

  struct Request {
    address account;
    uint256 templateId;
  }

  mapping(bytes32 => Request) internal _queue;

  constructor(
    string memory name,
    string memory symbol,
    uint96 royalty,
    string memory baseTokenURI
  ) ERC721Upgradeable(name, symbol, royalty, baseTokenURI) {}

  function mintCommon(address account, uint256 templateId) public override(ERC721Upgradeable) onlyRole(MINTER_ROLE) {
    uint256 tokenId = _mintCommon(account, templateId);

    _upsertRecordField(tokenId, GRADE, 0);
    _upsertRecordField(tokenId, RARITY, 0);
  }

  function mintRandom(address to, uint256 templateId) external override onlyRole(MINTER_ROLE) {
    require(templateId != 0, "ERC721Random: wrong type");
    _queue[getRandomNumber()] = Request(to, templateId);
  }

  function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
    Request memory request = _queue[requestId];
    uint256 tokenId = _tokenIdTracker.current();

    emit MintRandom(requestId, request.account, randomness, request.templateId, tokenId);

    _upsertRecordField(tokenId, TEMPLATE_ID, request.templateId);
    _upsertRecordField(tokenId, GRADE, 0);
    _upsertRecordField(tokenId, RARITY, _getDispersion(randomness));

    delete _queue[requestId];
    _mintCommon(request.account, request.templateId);
  }

  function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
    return interfaceId == type(IERC721Random).interfaceId || super.supportsInterface(interfaceId);
  }
}
