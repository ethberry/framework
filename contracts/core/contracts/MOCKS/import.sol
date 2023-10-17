// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.20;

import {Wallet} from "@gemunion/contracts-mocks/contracts/Wallet.sol";
import {Jerk} from "@gemunion/contracts-mocks/contracts/Jerk.sol";

import {VRFCoordinatorV2Mock} from "@gemunion/contracts-chain-link-v2/contracts/mocks/VRFCoordinatorV2.sol";

import {ERC998ERC721ABERS} from "@gemunion/contracts-erc998td/contracts/preset/ERC998ERC721ABERS.sol";
import {ERC721ABEC} from "@gemunion/contracts-erc721e/contracts/preset/ERC721ABEC.sol";
import {ERC20ABC} from "@gemunion/contracts-erc20/contracts/preset/ERC20ABC.sol";
import {ERC20ABNon1363} from "@gemunion/contracts-erc20/contracts/mocks/ERC20ABNon1363.sol";
