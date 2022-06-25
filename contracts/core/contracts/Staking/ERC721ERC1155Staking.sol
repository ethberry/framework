// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+impulse@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/utils/Address.sol";

import "../ERC1155/interfaces/IERC1155Simple.sol";

contract ERC721ERC1155Staking is Ownable, ERC721Holder {
  IERC721 private _acceptedToken;
  IERC1155Simple private _rewardToken;
  using Address for address;

  uint256 private _limit = 5;

  struct Miner {
    uint256 minerId;
    uint256 resourceId;
    uint256 timestamp;
  }

  // owner => Miners
  mapping(address => Miner[]) private _miners;
  // resourceId => ratio per million
  mapping(uint256 => uint256) private _ratio;

  event Deposit(address commander, uint256 heroId, uint256 resourceId);
  event Withdraw(address commander, uint256 heroId, uint256 resourceId, uint256 amount);
  event WithdrawBatch(address commander, uint256[] heroIds, uint256[] resourceIds, uint256[] amounts);

  constructor(address acceptedToken, address rewardToken) {
    require(acceptedToken.isContract(), "Mine: the factory must be a deployed contract");
    _acceptedToken = IERC721(acceptedToken);
    require(rewardToken.isContract(), "Mine: the factory must be a deployed contract");
    _rewardToken = IERC1155Simple(rewardToken);
  }

  function deposit(uint256 minerId, uint256 resourceId) public {
    address commander = _msgSender();

    require(_miners[commander].length < _limit, "Mine: mine capacity reached");
    require(_ratio[resourceId] > 0, "Mine: resource exhausted");

    _acceptedToken.safeTransferFrom(commander, address(this), minerId);
    _miners[commander].push(Miner(minerId, resourceId, block.timestamp));
    emit Deposit(commander, minerId, resourceId);
  }

  function withdraw(uint256 minerId) public {
    address commander = _msgSender();

    Miner memory miner;
    for (uint256 j = 0; j < _miners[commander].length; j++) {
      miner = _miners[commander][j];
      if (miner.minerId == minerId) {
        _acceptedToken.safeTransferFrom(address(this), commander, minerId);
        remove(commander, j);
      }
    }

    require(miner.timestamp != 0, "Mine: miner not found");

    uint256 amount = getAmount(miner.resourceId, miner.timestamp);
    _rewardToken.mint(commander, miner.resourceId, amount, "0x");
    emit Withdraw(commander, miner.minerId, miner.resourceId, amount);
  }

  function withdrawHeroBatch(uint256[] memory tokenIds) public {
    uint256[] memory heroIds = new uint256[](tokenIds.length);
    uint256[] memory resourceIds = new uint256[](tokenIds.length);
    uint256[] memory amounts = new uint256[](tokenIds.length);

    address commander = _msgSender();

    for (uint256 i = 0; i < tokenIds.length; i++) {
      for (uint256 j = 0; j < _miners[commander].length; j++) {
        Miner memory miner = _miners[commander][j];
        if (miner.minerId == heroIds[i]) {
          heroIds[i] = miner.resourceId;
          resourceIds[i] = miner.resourceId;
          amounts[i] = getAmount(miner.resourceId, miner.timestamp);
          _acceptedToken.safeTransferFrom(address(this), commander, heroIds[i]);
          remove(commander, j);
        }
      }
    }

    _rewardToken.mintBatch(commander, resourceIds, amounts, "");
    emit WithdrawBatch(commander, heroIds, resourceIds, amounts);
  }

  function setLimit(uint256 limit) public onlyOwner {
    _limit = limit;
  }

  function updateRatio(uint256 resourceId, uint256 ratio) public onlyOwner {
    _ratio[resourceId] = ratio;
  }

  function getAmount(uint256 resourceId, uint256 timestamp) private view returns (uint256 amount) {
    uint256 duration = block.timestamp - timestamp;
    amount = _ratio[resourceId] * duration / 1e6;
  }

  function remove(address commander, uint256 index) private {
    _miners[commander][index] = _miners[commander][_miners[commander].length - 1];
    _miners[commander].pop();
  }
}
