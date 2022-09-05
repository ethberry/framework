// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.9;

import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/utils/Context.sol";

import "../interfaces/IERC20AndERC223.sol";
import "../interfaces/IERC998ERC20TopDown.sol";
import "../interfaces/IERC998TopDown.sol";
import "./ERC998Utils.sol";


abstract contract ERC998ERC20 is Context, ERC165, IERC721, IERC998TopDown, IERC998ERC20TopDown, ERC998Utils {
  using EnumerableSet for EnumerableSet.AddressSet;

  // tokenId => (token contract => balance)
  mapping(uint256 => mapping(address => uint256)) erc20Balances;


  function transferERC20(
    uint256 _tokenId,
    address _to,
    address _erc20Contract,
    uint256 _value
  ) external override {
    require(_to != address(0), "CTD:to 0");
    address sender = _msgSender();
    _ownerOrApproved(sender, _tokenId);
    _removeERC20(_tokenId, _to, _erc20Contract, _value);
    require(IERC20AndERC223(_erc20Contract).transfer(_to, _value), "CTD:TFR err");
  }

  // implementation of ERC 223
  function transferERC223(
    uint256 _tokenId,
    address _to,
    address _erc223Contract,
    uint256 _value,
    bytes memory _data
  ) external override {
    require(_to != address(0), "CTD:to 0");
    address sender = _msgSender();
    _ownerOrApproved(sender, _tokenId);
    _removeERC20(_tokenId, _to, _erc223Contract, _value);
    require(IERC20AndERC223(_erc223Contract).transfer(_to, _value, _data), "CTD:TFR err");
  }

  function _removeERC20(
    uint256 _tokenId,
    address _to,
    address _erc20Contract,
    uint256 _value
  ) internal {
    uint256 erc20Balance = erc20Balances[_tokenId][_erc20Contract];
    require(erc20Balance >= _value, "CTD:NE");

    _beforeRemoveERC20(_tokenId, _to, _erc20Contract, _value);

    uint256 newERC20Balance;
    unchecked {
      // overflow already checked
      newERC20Balance = erc20Balance - _value;
    }
    erc20Balances[_tokenId][_erc20Contract] = newERC20Balance;

    emit TransferChild(_tokenId, _to, _erc20Contract, 0, _value);

    _afterRemoveERC20(_tokenId, _to, _erc20Contract, _value);
  }

  function _beforeRemoveERC20(
    uint256 _tokenId,
    address _to,
    address _erc20Contract,
    uint256 _value
  ) internal virtual {}

  function _afterRemoveERC20(
    uint256 _tokenId,
    address _to,
    address _erc20Contract,
    uint256 _value
  ) internal virtual {}

  function balanceOfERC20(uint256 _tokenId, address _erc20Contract) external view override returns (uint256) {
    return erc20Balances[_tokenId][_erc20Contract];
  }

  // used by ERC 223
  function tokenFallback(
    address _from,
    uint256 _value,
    bytes memory _data
  ) external override {
    require(_data.length > 0, "CTD: 0 data");
    address sender = _msgSender();
    require(tx.origin != sender, "CTD:not ctr");
    uint256 tokenId = _parseTokenId(_data);
    _erc20Received(_from, tokenId, sender, _value);
  }

  // this contract has to be approved first by _erc20Contract
  function getERC20(
    address _from,
    uint256 _tokenId,
    address _erc20Contract,
    uint256 _value
  ) public override {
    address sender = _msgSender();
    if (_from != sender) {
      try IERC20AndERC223(_erc20Contract).allowance(_from, sender) returns (uint256 remaining) {
        require(remaining >= _value, "CTD:NE");
      } catch {
        revert("CTD:ALLW err");
      }
    }
    _erc20Received(_from, _tokenId, _erc20Contract, _value);
    require(
      IERC20AndERC223(_erc20Contract).transferFrom(_from, address(this), _value),
      "CTD:TRF err"
    );
  }

  function _erc20Received(
    address _from,
    uint256 _tokenId,
    address _erc20Contract,
    uint256 _value
  ) internal {
    require(ownerOf(_tokenId) != address(0), "CTD:tNE");

//    _beforeERC20Received(_from, _tokenId, _erc20Contract, _value);

    uint256 newErc20Balance = erc20Balances[_tokenId][_erc20Contract] + _value;
    erc20Balances[_tokenId][_erc20Contract] = newErc20Balance;

    emit ReceivedChild(_from, _tokenId, _erc20Contract, 0, _value);

//    _afterReceivedERC20(_from, _tokenId, _erc20Contract, _value);
  }

//  function _beforeERC20Received(
//    address _from,
//    uint256 _tokenId,
//    address _erc20Contract,
//    uint256 _value
//  ) internal virtual {}
//
//  function _afterReceivedERC20(
//    address _from,
//    uint256 _tokenId,
//    address _erc20Contract,
//    uint256 _value
//  ) internal virtual {}

  function supportsInterface(bytes4 interfaceId) public view virtual override(IERC165, ERC165) returns (bool) {
    return interfaceId == type(IERC998ERC20TopDown).interfaceId || super.supportsInterface(interfaceId);
  }

  ////////////////////////////////////////////////////////
  // ERC721 mock
  ////////////////////////////////////////////////////////

  function ownerOf(uint256 tokenId) public view virtual override returns (address);
}
