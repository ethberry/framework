// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@gemunion/contracts-mocks/contracts/Wallet.sol";

import "../Mechanics/Wrapper/interfaces/IERC721Wrapper.sol";

contract WrapperMock is Wallet {
  function unpack(address wrapper, uint256 tokenId) public {
    IERC721Wrapper(wrapper).unpack(tokenId);
  }
}
