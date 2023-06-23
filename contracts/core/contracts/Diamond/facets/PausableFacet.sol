// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts (last updated v4.7.0) (security/Pausable.sol)

pragma solidity ^0.8.0;

import "../override/PausableInternal.sol";

/**
 * @dev Contract module which allows children to implement an emergency stop
 * mechanism that can be triggered by an authorized account.
 *
 * This module is used through inheritance. It will make available the
 * modifiers `whenNotPaused` and `whenPaused`, which can be applied to
 * the functions of your contract. Note that they will not be pausable by
 * simply including this module, only once the modifiers are put in place.
 */
contract PausableFacet is PausableInternal {

    /**
     * @dev Returns true if the contract is paused, and false otherwise.
     */
    function paused() public view virtual returns (bool) {
        return _paused();
    }

    /**
     * @dev Returns true if the contract is paused, and false otherwise.
     */
    function pause() external virtual {
        _pause();
    }

    /**
     * @dev Returns true if the contract is paused, and false otherwise.
     */
    function unpause() external virtual {
        _unpause();
    }
}
