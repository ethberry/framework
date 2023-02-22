// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "../../../Exchange/interfaces/IAsset.sol";

interface IERC721TokenWrapper {
    event UnpackWrapper(uint256 tokenId);

    function mintBox(address to, uint256 templateId, Asset[] memory items) external payable;
    function unpack(uint256 tokenId) external;
}