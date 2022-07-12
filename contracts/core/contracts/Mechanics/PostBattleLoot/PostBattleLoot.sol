// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";
import "@openzeppelin/contracts/utils/cryptography/SignatureChecker.sol";

import "../Asset/Asset.sol";
import "../Asset/interfaces/IAsset.sol";
import "../../ERC1155/interfaces/IERC1155Simple.sol";

contract PostBattleLoot is AssetHelper, AccessControl, Pausable, EIP712 {
  using Address for address;

  mapping(bytes32 => bool) private _expired;
  bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
  bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

  bytes32 internal immutable PERMIT_SIGNATURE =
    keccak256(bytes.concat("EIP712(bytes32 nonce,address account,Asset[] items)", ASSET_SIGNATURE));

  event RedeemLoot(address from, Asset[] item);

  constructor(string memory name) EIP712(name, "1.0.0") {
    _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
    _setupRole(MINTER_ROLE, _msgSender());
    _setupRole(PAUSER_ROLE, _msgSender());
  }

  function redeem(
    bytes32 nonce,
    Asset[] memory items,
    address signer,
    bytes calldata signature
  ) external whenNotPaused {
    require(hasRole(MINTER_ROLE, signer), "PostBattleLoot: Wrong signer");

    require(!_expired[nonce], "PostBattleLoot: Expired signature");
    _expired[nonce] = true;

    address account = _msgSender();

    bool isVerified = _verify(signer, _hash(nonce, account, items), signature);
    require(isVerified, "PostBattleLoot: Invalid signature");

    emit RedeemLoot(account, items);

    for (uint256 i = 0; i < items.length; i++) {
      if (items[i].tokenType == TokenType.ERC1155) {
        IERC1155Simple(items[i].token).mint(account, items[i].tokenId, items[i].amount, "0x");
      } else {
        revert("PostBattleLoot: unsupported token type");
      }
    }
  }

  function _hash(
    bytes32 nonce,
    address account,
    Asset[] memory items
  ) internal view returns (bytes32) {
    return _hashTypedDataV4(keccak256(abi.encode(PERMIT_SIGNATURE, nonce, account, hashAssetStructArray(items))));
  }

  function _verify(
    address signer,
    bytes32 digest,
    bytes memory signature
  ) internal view returns (bool) {
    return SignatureChecker.isValidSignatureNow(signer, digest, signature);
  }

  function supportsInterface(bytes4 interfaceId) public view virtual override(AccessControl) returns (bool) {
    return super.supportsInterface(interfaceId);
  }

  function pause() public virtual onlyRole(PAUSER_ROLE) {
    _pause();
  }

  function unpause() public virtual onlyRole(PAUSER_ROLE) {
    _unpause();
  }

  receive() external payable {
    revert();
  }
}
