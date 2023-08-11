// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/utils/Context.sol";
import "@gemunion/contracts-misc/contracts/attributes.sol";
import "../Diamond/lib/LibDiamond.sol";
import "../Diamond/override/AccessControlInternal.sol";
import { AccessControlInit, PausableInit, DiamondInit } from "../Diamond/facets/init/index.sol";

contract DiamondCMInit is Context, DiamondInit, PausableInit, AccessControlInit, AccessControlInternal {

    function init() public override(DiamondInit, PausableInit, AccessControlInit) {
        super.init();

        _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
    }
}
