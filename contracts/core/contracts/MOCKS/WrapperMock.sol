// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "./WalletMock.sol";
import "../Mechanics/TokenWrapper/ERC721TokenWrapper.sol";
import "../Mechanics/TokenWrapper/interfaces/IERC721TokenWrapper.sol";

contract WrapperMock is WalletMock {
    function unpack(address wrapper, uint256 tokenId) public {
        IERC721TokenWrapper(wrapper).unpack(tokenId);
    }
}