// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.20;

import "./AbstractFactoryFacet.sol";

contract WalletFactoryFacet is AbstractFactoryFacet, SignatureValidatorCM {
  constructor() SignatureValidatorCM() {}

  bytes32 private immutable WALLET_PERMIT_SIGNATURE =
    keccak256(bytes.concat("EIP712(Params params)", PARAMS_SIGNATURE));

  event WalletDeployed(address account, uint256 externalId);

  function deployWallet(Params calldata params, bytes calldata signature) external returns (address account) {
    _checkNonce(params.nonce);

    address signer = _recoverSigner(_hashWallet(params), signature);

    if (!_hasRole(DEFAULT_ADMIN_ROLE, signer)) {
      revert SignerMissingRole();
    }

    account = deploy2(params.bytecode, abi.encode(), params.nonce);

    emit WalletDeployed(account, params.externalId);
  }

  function _hashWallet(Params calldata params) internal view returns (bytes32) {
    return _hashTypedDataV4(keccak256(abi.encodePacked(WALLET_PERMIT_SIGNATURE, _hashParamsStruct(params))));
  }
}
