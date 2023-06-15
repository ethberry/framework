// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";

import "../Mechanics/Disperse/interfaces/IDisperse.sol";

contract ReentrancyDisperse is ERC165, ERC721Holder, ERC1155Holder {
  IDisperse disperse;
  address token;

  constructor(IDisperse _disperse, address _token) {
    disperse = _disperse;
    token = _token;
  }

  function onERC721Received(
    address operator,
    address from,
    uint256 tokenId,
    bytes calldata data
  ) public override returns (bytes4) {
    Asset[] memory items = new Asset[](1);
    items[0] = Asset(TokenType.ERC721, token, 2, 1);
    address[] memory receivers = new address[](1);
    receivers[0] = address(this);
    (bool success, bytes memory data) = address(disperse).call(
      abi.encodeWithSelector(disperse.disperse.selector, items, receivers)
    );
    return super.onERC721Received(operator, from, tokenId, data);
  }

  function onERC1155Received(
    address operator,
    address from,
    uint256 id,
    uint256 value,
    bytes calldata data
  ) public virtual override returns (bytes4) {
    Asset[] memory items = new Asset[](1);
    items[0] = Asset(TokenType.ERC1155, token, 1, 100000);
    address[] memory receivers = new address[](1);
    receivers[0] = address(this);
    (bool success, bytes memory data) = address(disperse).call(
      abi.encodeWithSelector(disperse.disperse.selector, items, receivers)
    );
    return super.onERC1155Received(operator, from, id, value, data);
  }

  receive() external payable {
    uint256 balance = address(msg.sender).balance;
    if (balance > 0) {
      Asset[] memory items = new Asset[](1);
      items[0] = Asset(TokenType.NATIVE, address(0), 0, balance);
      address[] memory receivers = new address[](1);
      receivers[0] = address(this);
      (bool success, bytes memory data) = address(disperse).call(
        abi.encodeWithSelector(disperse.disperse.selector, items, receivers)
      );
    }
  }

  /**
   * @dev See {IERC165-supportsInterface}.
   */
  function supportsInterface(bytes4 interfaceId) public view virtual override(ERC165, ERC1155Receiver) returns (bool) {
    return
      interfaceId == type(IERC721Receiver).interfaceId ||
      interfaceId == type(IERC1155Receiver).interfaceId ||
      super.supportsInterface(interfaceId);
  }
}
