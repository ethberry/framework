// SPDX-License-Identifier: UNLICENSED

// Author: PavelZavadskiy
// Email: pavelzavadsky@gmail.com
// GitHub: https://github.com/PavelZavadskiy

pragma solidity ^0.8.9;

contract WhiteListChild {
  uint256 private _defaultMaxChildPerContract;
  mapping(address => bool) _whiteListChildAccess;
  mapping(address => uint256) private _childContractsCounter;
  mapping(address => uint256) private _maxChildPerContract;

  event WhitelistedChild(address indexed addr, uint256 maxCount);
  event UnWhitelistedChild(address indexed addr);
  event SetMaxChild(address indexed addr, uint256 maxCount);

  function _whiteListChild(address addr, uint256 max) internal {
    _whiteListChildAccess[addr] = true;
    _maxChildPerContract[addr] = max;
    emit WhitelistedChild(addr, max);
  }

  function _unWhitelistChild(address addr) internal {
    _whiteListChildAccess[addr] = false;
    _maxChildPerContract[addr] = 0;
    emit UnWhitelistedChild(addr);
  }

  function isWhitelisted(address addr) public view returns (bool) {
    return _whiteListChildAccess[addr];
  }

  function getMaxChild(address addr) public view returns (uint256) {
    if (_maxChildPerContract[addr] > 0) {
      return _maxChildPerContract[addr];
    }
    return _defaultMaxChildPerContract;
  }

  function _setDefaultMaxChild(uint256 max) internal {
    _defaultMaxChildPerContract = max;
    emit SetMaxChild(address(0), max);
  }

  function _setMaxChild(address addr, uint256 max) internal {
    _maxChildPerContract[addr] = max;
    emit SetMaxChild(addr, max);
  }

  function getChildCount(address addr) public view onlyWhiteListed(addr) returns (uint256) {
    return _childContractsCounter[addr];
  }

  function incrementChildCount(address addr) public onlyWhiteListed(addr) {
    uint256 max = _maxChildPerContract[addr] > 0 ? _maxChildPerContract[addr] : _defaultMaxChildPerContract;
    if (max > 0) {
      require(_childContractsCounter[addr] < max, "WhiteListChild: excess number of address");
    }
    _childContractsCounter[addr]++;
  }

  function decrementChildCount(address addr) public onlyWhiteListed(addr) {
    if (_childContractsCounter[addr] > 0) {
      _childContractsCounter[addr]--;
    }
  }

  modifier onlyWhiteListed(address addr) {
    require(isWhitelisted(addr), "WhiteListChild: the contract is not on the whitelist");
    _;
  }

  modifier onlyWhiteListedWithIncrement(address addr) {
    incrementChildCount(addr);
    _;
  }

  modifier onlyWhiteListedWithDecrement(address addr) {
    decrementChildCount(addr);
    _;
  }
}
