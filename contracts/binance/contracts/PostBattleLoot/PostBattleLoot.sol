// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";
import "@openzeppelin/contracts/utils/cryptography/SignatureChecker.sol";

import "../ERC1155/interfaces/IERC1155Simple.sol";

contract PostBattleLoot is AccessControl, Pausable, EIP712 {
  using Address for address;

  mapping(bytes32 => bool) private _expired;
  bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
  bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

  bytes32 private immutable PERMIT_SIGNATURE =
  keccak256("EIP712(bytes32 nonce,address account,address collection,uint256[] tokenIds,uint256[] amounts)");

  event Redeem(address from, address collection, uint256[] tokenIds, uint256[] amounts);

  constructor(string memory name) EIP712(name, "1.0.0") {
    _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
    _setupRole(MINTER_ROLE, _msgSender());
    _setupRole(PAUSER_ROLE, _msgSender());
  }

  function redeem(
    bytes32 nonce,
    address account,
    address collection,
    uint256[] memory tokenIds,
    uint256[] memory amounts,
    address signer,
    bytes calldata signature
  ) external whenNotPaused {
    require(hasRole(MINTER_ROLE, signer), "PostBattleLoot: Wrong signer");

    require(!_expired[nonce], "PostBattleLoot: Expired signature");
    _expired[nonce] = true;

    bool isVerified = _verify(signer, _hash(nonce, account, collection, tokenIds, amounts), signature);
    require(isVerified, "PostBattleLoot: Invalid signature");

    emit Redeem(account, collection, tokenIds, amounts);
    IERC1155Simple(collection).mintBatch(account, tokenIds, amounts, "0x");
  }

  function _hash(
    bytes32 nonce,
    address account,
    address collection,
    uint256[] memory tokenIds,
    uint256[] memory amounts
  ) internal view returns (bytes32) {
    return
    _hashTypedDataV4(
      keccak256(
        abi.encode(
          PERMIT_SIGNATURE,
          nonce,
          account,
          collection,
          keccak256(abi.encodePacked(tokenIds)),
          keccak256(abi.encodePacked(amounts))
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
