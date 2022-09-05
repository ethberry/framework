// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "../ERC721/ERC721Simple.sol";
import "./extensions/WhiteListChild.sol";
import "./extensions/ERC998ERC721.sol";

contract ERC998Simple is ERC721Simple, ERC998ERC721, WhiteListChild {
  constructor(
    string memory name,
    string memory symbol,
    uint96 royalty,
    string memory baseTokenURI
  ) ERC721Simple(name, symbol, royalty, baseTokenURI) {}

  function ownerOf(uint256 tokenId) public view virtual override(ERC721, ERC998ERC721) returns (address) {
    return super.ownerOf(tokenId);
  }

  function isApprovedForAll(address owner, address operator)
    public
    view
    virtual
    override(ERC721, ERC998ERC721)
    returns (bool)
  {
    return super.isApprovedForAll(owner, operator);
  }

  function approve(address to, uint256 _tokenId) public virtual override(ERC721, ERC998ERC721) {
    ERC998ERC721.approve(to, _tokenId);
  }

  function getApproved(uint256 _tokenId) public view virtual override(ERC721, ERC998ERC721) returns (address) {
    return ERC998ERC721.getApproved(_tokenId);
  }

  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 tokenId
  ) internal virtual override(ERC721ACBER, ERC998ERC721) {
    ERC998ERC721._beforeTokenTransfer(from, to, tokenId);
    super._beforeTokenTransfer(from, to, tokenId);
  }

  function supportsInterface(bytes4 interfaceId)
    public
    view
    virtual
    override(AccessControl, ERC721Simple, ERC998ERC721)
    returns (bool)
  {
    return super.supportsInterface(interfaceId);
  }

  function removeChild(
    uint256 _tokenId,
    address _childContract,
    uint256 _childTokenId
  ) internal override onlyWhiteListedWithDecrement(_childContract) {
    super.removeChild(_tokenId, _childContract, _childTokenId);
  }

  function receiveChild(
    address _from,
    uint256 _tokenId,
    address _childContract,
    uint256 _childTokenId
  ) internal override onlyWhiteListedWithIncrement(_childContract) {
    super.receiveChild(_from, _tokenId, _childContract, _childTokenId);
  }

//  function whiteListChild(address addr, uint256 max) public onlyRole(DEFAULT_ADMIN_ROLE){
//    _whiteListChild(addr, max);
//  }
//
//  function unWhitelistChild(address addr) public onlyRole(DEFAULT_ADMIN_ROLE) {
//    _unWhitelistChild(addr);
//  }

//  function setDefaultMaxChild(uint256 max) public onlyRole(DEFAULT_ADMIN_ROLE) {
//    _setDefaultMaxChild(max);
//  }

//  function setMaxChild(address addr, uint256 max) public onlyRole(DEFAULT_ADMIN_ROLE) {
//    _setMaxChild(addr, max);
//  }
}
