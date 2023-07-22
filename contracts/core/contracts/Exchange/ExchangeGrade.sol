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
import "../ERC721/interfaces/IERC721Discrete.sol";

abstract contract ExchangeGrade is SignatureValidator, AccessControl, Pausable {
  event Upgrade(address account, uint256 externalId, bytes32 attribute, Asset item, Asset[] price);

  function upgrade(
    Params memory params,
    Asset memory item,
    Asset[] memory price,
    bytes calldata signature
  ) external payable whenNotPaused {
    if (!hasRole(METADATA_ROLE, _recoverOneToManySignature(params, item, price, signature))) {
      revert SignerMissingRole();
    }

    ExchangeUtils.spendFrom(price, _msgSender(), address(this), DisabledTokenTypes(false, false, false, false, false));

    emit Upgrade(_msgSender(), params.externalId, params.extra, item, price);

    IERC721Discrete(item.token).upgrade(item.tokenId, params.extra);
  }
}
