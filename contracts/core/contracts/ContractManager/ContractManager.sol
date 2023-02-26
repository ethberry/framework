// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/access/AccessControl.sol";

import "./VestingFactory.sol";
import "./ERC20Factory.sol";
import "./ERC721Factory.sol";
import "./ERC998Factory.sol";
import "./ERC1155Factory.sol";
import "./MysteryboxFactory.sol";
import "./CollectionFactory.sol";

contract ContractManager is
  AccessControl,
  VestingFactory,
  ERC20Factory,
  ERC721Factory,
  ERC998Factory,
  ERC1155Factory,
  MysteryboxFactory,
  CollectionFactory
{
  function destroy() public onlyRole(DEFAULT_ADMIN_ROLE) {
    selfdestruct(payable(_msgSender()));
  }
}
