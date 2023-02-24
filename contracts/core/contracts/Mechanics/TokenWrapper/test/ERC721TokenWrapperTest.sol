// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "../ERC721Wrapper.sol";

contract ERC721WrapperTest is ERC721Wrapper {
  constructor(
    string memory name,
    string memory symbol,
    uint96 royalty,
    string memory baseTokenURI
  ) ERC721Wrapper(name, symbol, royalty, baseTokenURI) {}

  function mintCommon(address account, uint256 templateId) external virtual override onlyRole(MINTER_ROLE) {
    _mintCommon(account, templateId);
  }
}
