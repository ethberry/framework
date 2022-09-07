// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Context.sol";

import "./extensions/ERC998ERC20.sol";
import "./ERC998Simple.sol";

contract ERC998ERC20Simple is ERC998Simple, ERC998ERC20 {
  constructor(
    string memory name,
    string memory symbol,
    uint96 royalty,
    string memory baseTokenURI
  ) ERC998Simple(name, symbol, royalty, baseTokenURI) {}

  function ownerOf(uint256 tokenId) public view virtual override(ERC998Simple, ERC998ERC20) returns (address) {
    return super.ownerOf(tokenId);
  }

  function supportsInterface(bytes4 interfaceId)
    public
    view
    virtual
    override(ERC998Simple, ERC998ERC20)
    returns (bool)
  {
    return super.supportsInterface(interfaceId);
  }

  function _ownerOrApproved(address sender, uint256 tokenId) internal view override(ERC998ERC721, ERC998Utils) {
     super._ownerOrApproved(sender, tokenId);
  }
}
