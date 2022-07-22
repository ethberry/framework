// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

import "./SignatureValidator.sol";
import "./ExchangeUtils.sol";
import "./interfaces/IAsset.sol";

abstract contract ExchangeClaim is SignatureValidator, ExchangeUtils, AccessControl, Pausable {
  event Claim(address from, uint256 externalId, Asset[] items);

  function claim(
    bytes32 nonce,
    Params memory params,
    Asset[] memory items,
    address signer,
    bytes calldata signature
  ) external payable whenNotPaused {
    require(hasRole(MINTER_ROLE, signer), "Exchange: Wrong signer");
    _verifyManyToManySignature(nonce, params, items, new Asset[](0), signer, signature);

    address account = _msgSender();

    acquire(items, account);

    emit Claim(account, params.externalId, items);
  }
}
