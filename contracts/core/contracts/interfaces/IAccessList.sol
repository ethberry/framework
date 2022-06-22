// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

interface IAccessList  {
  event Blacklisted(address indexed account);
  event UnBlacklisted(address indexed account);
  event Whitelisted(address indexed account);
  event UnWhitelisted(address indexed account);
}
