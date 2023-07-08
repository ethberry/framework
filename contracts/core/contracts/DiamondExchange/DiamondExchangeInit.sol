// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/utils/Context.sol";
import "@gemunion/contracts-misc/contracts/constants.sol";
import "../Diamond/lib/LibDiamond.sol";
import "../Diamond/override/AccessControlInternal.sol";
import { AccessControlInit, DiamondInit, PausableInit, WalletInit } from "../Diamond/facets/init/index.sol";

// import "../Diamond/facets/init/AccessControlInit.sol";
// import "../Diamond/facets/init/DiamondInit.sol";
// import "../Diamond/facets/init/PausableInit.sol";

contract DiamondExchangeInit is Context, DiamondInit, AccessControlInit, PausableInit, WalletInit, AccessControlInternal {
    
    function init() public override(DiamondInit, AccessControlInit, PausableInit, WalletInit) {
        super.init();

        _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
        _grantRole(MINTER_ROLE, _msgSender());
        _grantRole(PAUSER_ROLE, _msgSender());
        _grantRole(METADATA_ROLE, _msgSender());

        // supports interfaces
        // LibDiamond.DiamondStorage storage ds = LibDiamond.diamondStorage();
        // ds.supportedInterfaces[type(IAccessControl).interfaceId] = true;
    }
}
