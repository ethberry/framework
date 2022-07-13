// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";
import "@openzeppelin/contracts/utils/cryptography/SignatureChecker.sol";

import "../Asset/Asset.sol";
import "../Asset/interfaces/IAsset.sol";
import "../../ERC721/interfaces/IERC721Graded.sol";

contract MetaDataManipulator is AssetHelper, AccessControl, Pausable, EIP712 {
  mapping(bytes32 => bool) private _expired;
  bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
  bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

  bytes32 internal immutable PERMIT_SIGNATURE =
    keccak256(bytes.concat("EIP712(bytes32 nonce,address account,Asset item)", ASSET_SIGNATURE));

  constructor(string memory name) EIP712(name, "1.0.0") {
    _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
    _setupRole(MINTER_ROLE, _msgSender());
    _setupRole(PAUSER_ROLE, _msgSender());
  }

  function levelUp(
    bytes32 nonce,
    Asset memory item,
    address signer,
    bytes calldata signature
  ) external payable {
    require(hasRole(MINTER_ROLE, signer), "MetaDataManipulator: Wrong signer");

    require(!_expired[nonce], "MetaDataManipulator: Expired signature");
    _expired[nonce] = true;

    address account = _msgSender();

    bool isVerified = _verify(signer, _hash(nonce, account, item), signature);
    require(isVerified, "MetaDataManipulator: Invalid signature");

    IERC721Graded(item.token).levelUp(item.tokenId);
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
}
