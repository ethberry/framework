import { ethers } from "hardhat";

import { baseTokenURI, DEFAULT_ADMIN_ROLE, MINTER_ROLE, royalty, tokenName, tokenSymbol } from "../constants";
import { shouldHaveRole } from "../shared/accessControl/hasRoles";
import { shouldGetTokenURI } from "./shared/common/tokenURI";
import { shouldSetBaseURI } from "./shared/common/setBaseURI";
import { shouldMintCommon } from "./shared/common/mintCommon";
import { shouldMint } from "./shared/mint";
import { shouldSafeMint } from "./shared/safeMint";
import { shouldApprove } from "./shared/common/approve";
import { shouldGetBalanceOf } from "./shared/common/balanceOf";
import { shouldBurn } from "./shared/common/burn";
import { shouldGetOwnerOf } from "./shared/common/ownerOf";
import { shouldSetApprovalForAll } from "./shared/common/setApprovalForAll";
import { shouldSafeTransferFrom } from "./shared/common/safeTransferFrom";
import { shouldTransferFrom } from "./shared/common/transferFrom";

describe("ERC721Simple", function () {
  beforeEach(async function () {
    [this.owner, this.receiver] = await ethers.getSigners();

    const erc721Factory = await ethers.getContractFactory("ERC721Simple");
    this.erc721Instance = await erc721Factory.deploy(tokenName, tokenSymbol, royalty, baseTokenURI);

    const erc721ReceiverFactory = await ethers.getContractFactory("ERC721ReceiverMock");
    this.erc721ReceiverInstance = await erc721ReceiverFactory.deploy();

    const erc721NonReceiverFactory = await ethers.getContractFactory("ERC721NonReceiverMock");
    this.erc721NonReceiverInstance = await erc721NonReceiverFactory.deploy();

    this.contractInstance = this.erc721Instance;
  });

  shouldHaveRole(DEFAULT_ADMIN_ROLE, MINTER_ROLE);
  shouldMintCommon();
  shouldMint();
  shouldSafeMint();
  shouldApprove();
  shouldGetBalanceOf();
  shouldBurn();
  shouldGetOwnerOf();
  shouldSetApprovalForAll();
  shouldTransferFrom();
  shouldSafeTransferFrom();
  shouldGetTokenURI();
  shouldSetBaseURI();
});
