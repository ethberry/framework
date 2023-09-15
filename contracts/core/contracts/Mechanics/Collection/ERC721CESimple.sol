// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/utils/Counters.sol";

import "@gemunion/contracts-erc721/contracts/extensions/ERC721ABaseUrl.sol";
import "@gemunion/contracts-erc721ec/contracts/preset/ERC721ABERK.sol";

import "../../utils/errors.sol";

contract ERC721CESimple is ERC721ABERK, ERC721ABaseUrl {
  using Counters for Counters.Counter;

  Counters.Counter internal _tokenIdTracker;

  uint96 _batchSize;

  constructor(
    string memory name,
    string memory symbol,
    uint96 royalty,
    string memory baseTokenURI,
    uint96 batchSize,
    address owner
  ) ERC721ABERK(name, symbol, royalty) ERC721ABaseUrl(baseTokenURI) {
    _batchSize = batchSize;
    _mintConsecutive2(owner, batchSize);
  }

  // Default limit of 5k comes from this discussion
  // https://github.com/OpenZeppelin/openzeppelin-contracts/issues/2355#issuecomment-1200144796
  // to have more than 5k you might want to override _mintConsecutive and emit more than one event
  function _maxBatchSize() internal view override returns (uint96) {
    return _batchSize;
  }

  function _mintConsecutive2(address owner, uint96 batchSize) internal override returns (uint96) {
    return super._mintConsecutive(owner, batchSize);
  }

  function mintConsecutive(address to) public virtual onlyRole(MINTER_ROLE) {
    _safeMint(to, _totalConsecutiveSupply() + _tokenIdTracker.current());
    _tokenIdTracker.increment();
  }

  function mint(address) public pure {
    revert MethodNotSupported();
  }

  function safeMint(address) public pure {
    revert MethodNotSupported();
  }

  /**
   * @dev See {IERC165-supportsInterface}.
   */
  function supportsInterface(
    bytes4 interfaceId
  ) public view virtual override(AccessControl, ERC721ABERK) returns (bool) {
    return super.supportsInterface(interfaceId);
  }

  function _baseURI() internal view virtual override(ERC721, ERC721ABaseUrl) returns (string memory) {
    return _baseURI(_baseTokenURI);
  }

  receive() external payable {
    revert();
  }
}
