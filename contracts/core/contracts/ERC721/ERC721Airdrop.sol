// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";
import "@openzeppelin/contracts/utils/cryptography/SignatureChecker.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol";

import "@gemunion/contracts/contracts/ERC721/preset/ERC721ACBCR.sol";
import "@gemunion/contracts/contracts/ERC721/ERC721BaseUrl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "../ERC721/interfaces/IERC721Random.sol";

contract ERC721Airdrop is EIP712, ERC721ACBCR, ERC721Pausable, ERC721BaseUrl {
  using Address for address;
  using Counters for Counters.Counter;

  Counters.Counter internal _tokenIdTracker;

  struct ItemData {
    uint256 templateId;
  }

  IERC721Random _factory;

  mapping(uint256 => ItemData) internal _itemData;

  bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
  bytes32 public constant PERMIT_SIGNATURE = keccak256("EIP712(address account,uint256 airdropId,uint256 templateId)");

  event UnpackAirdrop(address collection, uint256 tokenId, uint256 templateId, uint256 airdropId);
  event RedeemAirdrop(address from, address collection, uint256 tokenId, uint256 templateId, uint256 price);

  constructor(
    string memory name,
    string memory symbol,
    uint256 cap,
    uint96 royalty,
    string memory baseTokenURI
  ) ERC721ACBCR(name, symbol, cap, royalty) ERC721BaseUrl(baseTokenURI) EIP712(name, "1.0.0") {
    _setupRole(PAUSER_ROLE, _msgSender());
    _tokenIdTracker.increment();
  }

  function redeem(
    address account,
    uint256 airdropId,
    uint256 templateId,
    address signer,
    bytes calldata signature
  ) public whenNotPaused {
    require(hasRole(MINTER_ROLE, signer), "ERC721Airdrop: Wrong signer");

    bool isVerified = _verify(signer, _hash(account, airdropId, templateId), signature);
    require(isVerified, "ERC721Airdrop: Invalid signature");

    _itemData[airdropId] = ItemData(templateId);

    _safeMint(account, airdropId);
    _tokenIdTracker.increment();

    emit RedeemAirdrop(account, address(this), airdropId, templateId, 0);
  }

  function _hash(
    address account,
    uint256 airdropId,
    uint256 templateId
  ) internal view returns (bytes32) {
    return _hashTypedDataV4(keccak256(abi.encode(PERMIT_SIGNATURE, account, airdropId, templateId)));
  }

  function _verify(
    address signer,
    bytes32 digest,
    bytes memory signature
  ) internal view returns (bool) {
    return SignatureChecker.isValidSignatureNow(signer, digest, signature);
  }

  function setFactory(address factory) external onlyRole(DEFAULT_ADMIN_ROLE) {
    require(factory.isContract(), "ERC721Airdrop: the factory must be a deployed contract");
    _factory = IERC721Random(factory);
  }

  function unpack(uint256 tokenId, uint256 airdropId) public whenNotPaused {
    require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721Airdrop: unpack caller is not owner nor approved");
    ItemData memory data = _itemData[tokenId];

    emit UnpackAirdrop(address(_factory), tokenId, data.templateId, airdropId);

    _factory.mintRandom(_msgSender(), data.templateId, airdropId);
    _burn(tokenId);
  }

  function _burn(uint256 tokenId) internal virtual override(ERC721, ERC721ACBCR) {
    super._burn(tokenId);
  }

  function setBaseURI(string memory baseTokenURI) external onlyRole(DEFAULT_ADMIN_ROLE) {
    _setBaseURI(baseTokenURI);
  }

  function _baseURI() internal view virtual override returns (string memory) {
    return _baseURI(_baseTokenURI);
  }

  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 tokenId
  ) internal virtual override(ERC721ACBCR, ERC721Pausable) {
    super._beforeTokenTransfer(from, to, tokenId);
  }

  function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, ERC721ACBCR) returns (bool) {
    return super.supportsInterface(interfaceId);
  }

  function pause() public onlyRole(PAUSER_ROLE) {
    _pause();
  }

  function unpause() public onlyRole(PAUSER_ROLE) {
    _unpause();
  }

  receive() external payable {
    revert();
  }
}
