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
import "../ERC721/interfaces/IERC721Upgradeable.sol";

abstract contract ExchangeGrade is SignatureValidator, AccessControl, Pausable {
  event Upgrade(address from, uint256 externalId, Asset item, Asset[] price);

  function upgrade(
    Params memory params,
    Asset memory item,
    Asset[] memory price,
    bytes calldata signature
  ) external payable whenNotPaused {
    address signer = _recoverOneToManySignature(params, item, price, signature);
    if (!hasRole(METADATA_ROLE, signer)) revert WrongSigner();

    address account = _msgSender();

    ExchangeUtils.spendFrom(price, account, address(this), DisabledTokenTypes(false, false, false, false, false));

    emit Upgrade(account, params.externalId, item, price);

    IERC721Upgradeable(item.token).upgrade(item.tokenId);
  }
}
