// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Counters.sol";

import "./ERC998Simple.sol";
import "./extensions/StateHash.sol";

contract ERC998StateHash is ERC998Simple, StateHash {
  using Counters for Counters.Counter;

  constructor(
    string memory name,
    string memory symbol,
    uint96 royalty,
    string memory baseTokenURI
  ) ERC998Simple(name, symbol, royalty, baseTokenURI) {}

  function _afterRemoveERC721(
    uint256 _tokenId,
    address _childContract,
    uint256 _childTokenId
  ) internal override(ERC998ERC721, StateHash) {
    super._afterRemoveERC721(_tokenId, _childContract, _childTokenId);
  }

  function _afterReceiveERC721(
    address _from,
    uint256 _tokenId,
    address _childContract,
    uint256 _childTokenId
  ) internal override(ERC998ERC721, StateHash) {
    super._afterReceiveERC721(_from, _tokenId, _childContract, _childTokenId);
  }

  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 tokenId
  ) internal override(ERC998Simple, StateHash) {
    super._beforeTokenTransfer(from, to, tokenId);
  }

  function _localRootId(uint256 tokenId) internal view override(ERC998ERC721, StateHash) returns (uint256) {
    return super._localRootId(tokenId);
  }

  function balanceOfERC20(uint256, address) external pure override(StateHash) returns (uint256) {
    revert("CTD: NS");
  }

  function balanceOfERC1155(
    uint256,
    address,
    uint256
  ) external pure override(StateHash) returns (uint256) {
    revert("CTD: NS");
  }
}
