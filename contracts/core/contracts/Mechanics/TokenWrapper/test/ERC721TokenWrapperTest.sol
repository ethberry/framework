// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "../ERC721TokenWrapper.sol";

contract ERC721TokenWrapperTest is ERC721TokenWrapper {
  constructor(
    string memory name,
    string memory symbol,
    uint96 royalty,
    string memory baseTokenURI
  ) ERC721TokenWrapper(name, symbol, royalty, baseTokenURI) {}

  function mintCommon(address account, uint256 templateId) external virtual override onlyRole(MINTER_ROLE) {
    _mintCommon(account, templateId);
  }
}
