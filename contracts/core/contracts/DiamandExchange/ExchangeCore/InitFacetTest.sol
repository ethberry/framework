// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;
import "../../Diamond/override/AccessControlInternal.sol";
import "@gemunion/contracts-misc/contracts/constants.sol";

contract InitFacetTest is AccessControlInternal {
    function init() public {
        _grantRole(MINTER_ROLE, msg.sender);
    }
}