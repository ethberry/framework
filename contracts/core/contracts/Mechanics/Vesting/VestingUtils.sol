// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "../Exchange/SignatureValidator.sol";
import "../Exchange/ExchangeUtils.sol";
import "../Exchange/interfaces/IAsset.sol";

abstract contract VestingUtils is ExchangeUtils, SignatureValidator {
  event Deposit(address from, Asset price);
  event Purchase(address from, Asset[] price);

  function beneficiary() public view virtual returns (address);

  function deposit(Asset memory price) external payable {
    address account = _msgSender();
    spend(toArray(price), account, address(this));
  }

  function purchase(
    Params memory params,
    Asset[] memory price,
    address signer,
    bytes calldata signature
  ) external payable {
    require(beneficiary() == signer, "Exchange: Wrong signer");
    _verifyManyToManySignature(params, new Asset[](0), price, signer, signature);

    address account = _msgSender();

    spend(price, account, address(this));

    // TODO set beneficiary
    // https://github.com/OpenZeppelin/openzeppelin-contracts/issues/3658

    emit Purchase(account, price);
  }
}
