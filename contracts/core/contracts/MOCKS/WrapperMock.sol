// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "./WalletMock.sol";
import "../Mechanics/Wrapper/ERC721Wrapper.sol";
import "../Mechanics/Wrapper/interfaces/IERC721Wrapper.sol";

contract WrapperMock is WalletMock {
  function unpack(address wrapper, uint256 tokenId) public {
    IERC721Wrapper(wrapper).unpack(tokenId);
  }
}
