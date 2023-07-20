// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "../utils/errors.sol";
import "./AbstractFactory.sol";

contract WaitListFactory is AbstractFactory {
  bytes32 private immutable WAIT_LIST_PERMIT_SIGNATURE =
    keccak256(bytes.concat("EIP712(Params params)", PARAMS_SIGNATURE));

  event WaitListDeployed(address account, uint256 externalId);

  function deployWaitList(Params calldata params, bytes calldata signature) external returns (address account) {
    _checkNonce(params.nonce);

    address signer = _recoverSigner(_hashWaitList(params), signature);

    if (!hasRole(DEFAULT_ADMIN_ROLE, signer)) {
      revert SignerMissingRole();
    }

    account = deploy2(params.bytecode, abi.encode(), params.nonce);

    emit WaitListDeployed(account, params.externalId);

    bytes32[] memory roles = new bytes32[](2);
    roles[0] = PAUSER_ROLE;
    roles[1] = DEFAULT_ADMIN_ROLE;

    fixPermissions(account, roles);
  }

  function _hashWaitList(Params calldata params) internal view returns (bytes32) {
    return _hashTypedDataV4(keccak256(abi.encodePacked(WAIT_LIST_PERMIT_SIGNATURE, _hashParamsStruct(params))));
  }
}
