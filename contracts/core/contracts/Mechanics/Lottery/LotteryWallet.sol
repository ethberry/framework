// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "@openzeppelin/contracts/finance/PaymentSplitter.sol";

import "@gemunion/contracts-erc1363/contracts/extensions/ERC1363Receiver.sol";

/**
 *@dev LotteryWallet contract to receive ETH, ERC1363 tokens, ERC721 tokens, and ERC1155 tokens from Lottery.
 */
contract LotteryWallet is ERC165, ERC721Holder, ERC1155Holder, ERC1363Receiver, PaymentSplitter {
  constructor(address[] memory payees, uint256[] memory shares) PaymentSplitter(payees, shares) {}

  /**
   * @dev See {IERC165-supportsInterface}.
   */
  function supportsInterface(bytes4 interfaceId) public view virtual override(ERC165, ERC1155Receiver) returns (bool) {
    return
      interfaceId == type(IERC1363Receiver).interfaceId ||
      interfaceId == type(IERC1363Spender).interfaceId ||
      interfaceId == type(IERC721Receiver).interfaceId ||
      interfaceId == type(IERC1155Receiver).interfaceId ||
      super.supportsInterface(interfaceId);
  }
}
