import { ethers } from "hardhat";

import { baseTokenURI, DEFAULT_ADMIN_ROLE, MINTER_ROLE, royalty, tokenName, tokenSymbol } from "../constants";
import { shouldHaveRole } from "../shared/accessControl/hasRoles";
import { shouldGetTokenURI } from "../ERC721/shared/tokenURI";
import { shouldSetBaseURI } from "../ERC721/shared/setBaseURI";
import { shouldBlacklist } from "../shared/blacklist";
import { shouldMint } from "../ERC721/shared/mint";
import { shouldSafeMint } from "../ERC721/shared/safeMint";
import { shouldMintCommon } from "../ERC721/shared/mintCommon";

describe("ERC998Full", function () {
  beforeEach(async function () {
    [this.owner, this.receiver] = await ethers.getSigners();

    const erc721Factory = await ethers.getContractFactory("ERC998Full");
    this.erc721Instance = await erc721Factory.deploy(tokenName, tokenSymbol, royalty, baseTokenURI);

    const erc721ReceiverFactory = await ethers.getContractFactory("ERC721ReceiverMock");
    this.erc721ReceiverInstance = await erc721ReceiverFactory.deploy();

    const erc721NonReceiverFactory = await ethers.getContractFactory("ERC721NonReceiverMock");
    this.erc721NonReceiverInstance = await erc721NonReceiverFactory.deploy();

    this.contractInstance = this.erc721Instance;
  });

  shouldHaveRole(DEFAULT_ADMIN_ROLE, MINTER_ROLE);
  shouldGetTokenURI();
  shouldSetBaseURI();
  shouldBlacklist();
  shouldMint();
  shouldSafeMint();
  shouldMintCommon();
});
