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

abstract contract ExchangeGrade is SignatureValidator, ExchangeUtils, AccessControl, Pausable {
  event Upgrade(address from, uint256 externalId, Asset item, Asset[] price);

  function upgrade(
    Params memory params,
    Asset memory item,
    Asset[] memory price,
    bytes calldata signature
  ) external payable whenNotPaused {
    address signer = _recoverOneToManySignature(params, item, price, signature);
    require(hasRole(METADATA_ROLE, signer), "Exchange: Wrong signer");

    address account = _msgSender();

    spendFrom(price, account, address(this), _disabledTypes);

    emit Upgrade(account, params.externalId, item, price);

    IERC721Upgradeable(item.token).upgrade(item.tokenId);
  }
}
