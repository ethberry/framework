// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "../override/SignatureValidator.sol";
import "../../../Diamond/override/AccessControlInternal.sol";
import "../../../Diamond/override/PausableInternal.sol";
import "../../DiamondExchange/lib/ExchangeUtils.sol";
import "../../../ERC721/interfaces/IERC721Discrete.sol";

contract ExchangeGradeFacet is SignatureValidator, AccessControlInternal, PausableInternal {
  event Upgrade(address from, uint256 externalId, Asset item, Asset[] price);

  constructor() SignatureValidator() {}

  function upgrade(
    Params memory params,
    Asset memory item,
    Asset[] memory price,
    bytes calldata signature
  ) external payable whenNotPaused {
    if (!_hasRole(METADATA_ROLE, _recoverOneToManySignature(params, item, price, signature))) {
      revert SignerMissingRole();
    }

    ExchangeUtils.spendFrom(price, _msgSender(), params.receiver, DisabledTokenTypes(false, false, false, false, false));

    emit Upgrade(_msgSender(), params.externalId, item, price);

    IERC721Discrete(item.token).upgrade(item.tokenId, params.extra);
  }
}
