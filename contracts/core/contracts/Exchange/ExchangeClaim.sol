// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

import "./SignatureValidator.sol";
import "./ExchangeUtils.sol";
import "./interfaces/IAsset.sol";

abstract contract ExchangeClaim is SignatureValidator, AccessControl, Pausable {
  event Claim(address from, uint256 externalId, Asset[] items);

  function claim(
    Params memory params,
    Asset[] memory items,
    bytes32 extra,
    bytes calldata signature
  ) external payable whenNotPaused {
    address signer = _recoverManyToManyExtraSignature(params, items, new Asset[](0), extra, signature);
    if (!hasRole(MINTER_ROLE, signer)) revert WrongSigner();

    address account = _msgSender();

    ExchangeUtils.acquire(items, account, DisabledTokenTypes(false, false, false, false, false));

    emit Claim(account, params.externalId, items);
  }
}
