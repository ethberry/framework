// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+undeads@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";
import "@openzeppelin/contracts/utils/cryptography/SignatureChecker.sol";

import "@gemunion/contracts/contracts/ERC721/preset/ERC721ACBPR.sol";
import "@gemunion/contracts/contracts/ERC721/ERC721BaseUrl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "../Marketplace/interfaces/IEIP712ERC721.sol";

contract AirdropERC721 is EIP712, ERC721ACBPR, ERC721BaseUrl {
  using Address for address;
  using Counters for Counters.Counter;

  Counters.Counter internal _tokenIdTracker;

  struct ItemData {
    uint256 templateId;
  }

  IEIP712ERC721 _factory;

  mapping(uint256 => ItemData) internal _itemData;
  uint256 internal _cap;
  uint256[] private _allTokens;

  bytes32 private immutable PERMIT_SIGNATURE = keccak256("EIP712(address account,uint256 airdropId,uint256 templateId)");

  event UnpackAirdrop(address collection, uint256 tokenId, uint256 templateId, uint256 airdropId);
  event Redeem(address from, address collection, uint256 tokenId, uint256 templateId, uint256 price);

  constructor(
    string memory name,
    string memory symbol,
    string memory baseTokenURI,
    uint96 royaltyNumerator,
    uint256 cap_
  ) ERC721ACBPR(name, symbol, baseTokenURI, royaltyNumerator) EIP712(name, "1.0.0") {
    require(cap_ > 0, "AirdropERC721: cap is 0");
    _cap = cap_;
    _tokenIdTracker.increment();
  }

  function redeem(
    address account,
    uint256 airdropId,
    uint256 templateId,
    address signer,
    bytes calldata signature
  ) public whenNotPaused {
    require(hasRole(MINTER_ROLE, signer), "AirdropERC721: Wrong signer");

    bool isVerified = _verify(signer, _hash(account, airdropId, templateId), signature);
    require(isVerified, "AirdropERC721: Invalid signature");

    _itemData[airdropId] = ItemData(templateId);

    _safeMint(account, airdropId);
    _tokenIdTracker.increment();

    emit Redeem(account, address(this), airdropId, templateId, 0);
  }

  function _hash(
    address account,
    uint256 airdropId,
    uint256 templateId
  ) internal view returns (bytes32) {
    return
      _hashTypedDataV4(
        keccak256(
          abi.encode(
            PERMIT_SIGNATURE,
            account,
            airdropId,
            templateId
          )
        )
      );
  }

  function _verify(
    address signer,
    bytes32 digest,
    bytes memory signature
  ) internal view returns (bool) {
    return SignatureChecker.isValidSignatureNow(signer, digest, signature);
  }

  function setFactory(address factory) external onlyRole(DEFAULT_ADMIN_ROLE) {
    require(factory.isContract(), "AirdropERC721: the factory must be a deployed contract");
    _factory = IEIP712ERC721(factory);
  }

  function unpack(uint256 tokenId, uint256 airdropId) public whenNotPaused {
    require(_isApprovedOrOwner(_msgSender(), tokenId), "AirdropERC721: unpack caller is not owner nor approved");
    ItemData memory data = _itemData[tokenId];

    emit UnpackAirdrop(address(_factory), tokenId, data.templateId, airdropId);

    _factory.mintRandom(_msgSender(), data.templateId, airdropId);
    _burn(tokenId);
  }

  function cap() public view virtual returns (uint256) {
    return _cap;
  }

  function totalSupply() public view virtual returns (uint256) {
    return _allTokens.length;
  }

  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 tokenId
  ) internal override virtual {
    require(totalSupply() < cap(), "AirdropERC721: cap exceeded");
    _allTokens.push(tokenId);
    super._beforeTokenTransfer(from, to, tokenId);
  }

  function _baseURI() internal view virtual override(ERC721ACBPR) returns (string memory) {
    return _baseURI(_baseTokenURI);
  }

  receive() external payable {
    revert();
  }
}
