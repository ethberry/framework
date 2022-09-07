// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

import "./SignatureValidator.sol";
import "./ExchangeUtils.sol";
import "./interfaces/IAsset.sol";
import "../../ERC721/interfaces/IERC721Upgradeable.sol";

abstract contract ExchangeBreed is SignatureValidator, ExchangeUtils, AccessControl, Pausable {
  event Breed(address from, uint256 externalId, Asset item, Asset price);

  function breed(
    Params memory params,
    Asset memory item,
    Asset memory price,
    address signer,
    bytes calldata signature
  ) external payable {
    require(hasRole(MINTER_ROLE, signer), "Exchange: Wrong signer");
    _verifyOneToOneSignature(params, item, price, signer, signature);

    address account = _msgSender();

    // TODO approved
    address ownerOf1 = IERC721(item.token).ownerOf(item.tokenId);
    require(ownerOf1 == account, "Exchange: Wrong signer");

    address ownerOf2 = IERC721(price.token).ownerOf(item.tokenId);
    require(ownerOf2 == account, "Exchange: Wrong signer");

    emit Breed(account, params.externalId, item, price);

    IERC721Random(item.token).mintRandom(account, params.externalId);
  }
}
