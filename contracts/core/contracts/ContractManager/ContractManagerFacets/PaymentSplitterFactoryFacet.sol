// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.20;

import {SignerMissingRole} from "../../utils/errors.sol";
import {SignatureValidatorCM} from "../override/SignatureValidator.sol";
import {AbstractFactoryFacet} from "./AbstractFactoryFacet.sol";

contract PaymentSplitterFactoryFacet is AbstractFactoryFacet, SignatureValidatorCM {
  constructor() SignatureValidatorCM() {}

  bytes private constant PAYMENT_SPLITTER_ARGUMENTS_SIGNATURE = "PaymentSplitterArgs(address[] payees,uint256[] shares)";
  bytes32 private constant PAYMENT_SPLITTER_ARGUMENTS_TYPEHASH = keccak256(PAYMENT_SPLITTER_ARGUMENTS_SIGNATURE);

  bytes32 private immutable PAYMENT_SPLITTER_PERMIT_SIGNATURE =
  keccak256(bytes.concat("EIP712(Params params,PaymentSplitterArgs args)", PARAMS_SIGNATURE, PAYMENT_SPLITTER_ARGUMENTS_SIGNATURE));

  struct PaymentSplitterArgs {
    address[] payees;
    uint256[] shares;
  }

  event PaymentSplitterDeployed(address account, uint256 externalId, PaymentSplitterArgs args);

  function deployPaymentSplitter(Params calldata params, PaymentSplitterArgs calldata args, bytes calldata signature) external returns (address account) {
    _checkNonce(params.nonce);

    address signer = _recoverSigner(_hashPaymentSplitter(params, args), signature);

    if (!_hasRole(DEFAULT_ADMIN_ROLE, signer)) {
      revert SignerMissingRole();
    }

    account = deploy2(params.bytecode, abi.encode(args.payees, args.shares), params.nonce);

    emit PaymentSplitterDeployed(account, params.externalId, args);
  }

  function _hashPaymentSplitter(Params calldata params, PaymentSplitterArgs calldata args) internal view returns (bytes32) {
    return _hashTypedDataV4(keccak256(
      abi.encodePacked(
        PAYMENT_SPLITTER_PERMIT_SIGNATURE,
        _hashParamsStruct(params),
        _hashPaymentSplitterStruct(args)
      )
    ));
  }

  function _hashPaymentSplitterStruct(PaymentSplitterArgs calldata args) private pure returns (bytes32) {
    return
      keccak256(
      abi.encode(
        PAYMENT_SPLITTER_ARGUMENTS_TYPEHASH,
        keccak256(abi.encodePacked(args.payees)),
        keccak256(abi.encodePacked(args.shares))
      )
    );
  }
}
