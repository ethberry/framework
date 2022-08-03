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

abstract contract ExchangeGrade is SignatureValidator, ExchangeUtils, AccessControl, Pausable {
  event Upgrade(address from, uint256 externalId, Asset item, Asset[] price);

  function upgrade(
    Params memory params,
    Asset memory item,
    Asset[] memory price,
    address signer,
    bytes calldata signature
  ) external payable {
    require(hasRole(MINTER_ROLE, signer), "Exchange: Wrong signer");
    _verifyOneToManySignature(params, item, price, signer, signature);

    address account = _msgSender();

    spend(price, account);

    emit Upgrade(account, params.externalId, item, price);

    IERC721Upgradeable(item.token).upgrade(item.tokenId);
  }
}
