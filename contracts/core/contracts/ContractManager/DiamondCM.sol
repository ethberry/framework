// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.20;

import "../Diamond/Diamond.sol";
import "../Diamond/lib/LibDiamond.sol";
import "../Diamond/override/AccessControlInternal.sol";

/**
 * todo create contract WalletDiamond. It have to be inherited by this contract.
 */
contract DiamondCM is Diamond, AccessControlInternal {
  constructor(address _contractOwner, address _diamondCutFacet) payable Diamond(_contractOwner, _diamondCutFacet) {
    // Can initialise some storage values here if needed.
  }
}
