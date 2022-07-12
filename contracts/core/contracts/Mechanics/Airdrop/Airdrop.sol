// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";
import "@openzeppelin/contracts/utils/cryptography/SignatureChecker.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol";

import "@gemunion/contracts/contracts/ERC721/preset/ERC721ACBCR.sol";
import "@gemunion/contracts/contracts/ERC721/ERC721BaseUrl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "../Asset/Asset.sol";
import "../Asset/interfaces/IAsset.sol";
import "../../ERC721/interfaces/IERC721Simple.sol";
import "../../ERC1155/interfaces/IERC1155Simple.sol";

contract Airdrop is AssetHelper, EIP712, ERC721ACBCR, ERC721Pausable, ERC721BaseUrl {
  using Address for address;
  using Counters for Counters.Counter;

  Counters.Counter internal _tokenIdTracker;

  mapping(bytes32 => bool) private _expired;
  mapping(uint256 => Asset) internal _itemData;

  bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

  bytes32 internal immutable PERMIT_SIGNATURE =
    keccak256(bytes.concat("EIP712(bytes32 nonce,address account,Asset item)", ASSET_SIGNATURE));

  event RedeemAirdrop(address from, uint256 tokenId, Asset item);
  event UnpackAirdrop(address from, uint256 tokenId, Asset item);

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
    bytes32 nonce,
    Asset calldata item,
    address signer,
    bytes calldata signature
  ) public whenNotPaused {
    require(hasRole(MINTER_ROLE, signer), "Airdrop: Wrong signer");

    require(!_expired[nonce], "Airdrop: Expired signature");
    _expired[nonce] = true;

    address account = _msgSender();

    bool isVerified = _verify(signer, _hash(nonce, account, item), signature);
    require(isVerified, "Airdrop: Invalid signature");

    uint256 tokenId = _tokenIdTracker.current();
    _tokenIdTracker.increment();

    _itemData[tokenId] = item;

    _safeMint(account, tokenId);

    emit RedeemAirdrop(account, tokenId, item);
  }

  function _hash(
    bytes32 nonce,
    address account,
    Asset memory item
  ) internal view returns (bytes32) {
    return _hashTypedDataV4(keccak256(abi.encode(PERMIT_SIGNATURE, nonce, account, hashAssetStruct(item))));
  }

  function _verify(
    address signer,
    bytes32 digest,
    bytes memory signature
  ) internal view returns (bool) {
    return SignatureChecker.isValidSignatureNow(signer, digest, signature);
  }

  function unpack(uint256 tokenId) public whenNotPaused {
    require(_isApprovedOrOwner(_msgSender(), tokenId), "Airdrop: caller is not token owner nor approved");
    Asset memory item = _itemData[tokenId];

    emit UnpackAirdrop(_msgSender(), tokenId, item);

    if (item.tokenType == TokenType.ERC721 || item.tokenType == TokenType.ERC998) {
      // TODO random
      tokenId = IERC721Simple(item.token).mintCommon(_msgSender(), item.tokenId);
    } else if (item.tokenType == TokenType.ERC1155) {
      IERC1155Simple(item.token).mint(_msgSender(), item.tokenId, item.amount, "0x");
      tokenId = item.tokenId;
    } else {
      revert("Airdrop: unsupported token type");
    }

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
