import { ethers } from "hardhat";

import { baseTokenURI, DEFAULT_ADMIN_ROLE, MINTER_ROLE, royalty, tokenName, tokenSymbol } from "../constants";
import { shouldHaveRole } from "../shared/accessControl/hasRoles";
// import { shouldGetTokenURI } from "../ERC721/shared/tokenURI";
// import { shouldSetBaseURI } from "../ERC721/shared/setBaseURI";
import { shouldMint } from "../ERC721/shared/mint";
import { shouldSafeMint } from "../ERC721/shared/safeMint";
import { expect } from "chai";

describe("ERC998Genes", function () {
  beforeEach(async function () {
    [this.owner, this.receiver] = await ethers.getSigners();

    const erc721Factory = await ethers.getContractFactory("ERC998Genes");
    this.erc721Instance = await erc721Factory.deploy(tokenName, tokenSymbol, royalty, baseTokenURI);

    const erc721ReceiverFactory = await ethers.getContractFactory("ERC721ReceiverMock");
    this.erc721ReceiverInstance = await erc721ReceiverFactory.deploy();

    const erc721NonReceiverFactory = await ethers.getContractFactory("ERC721NonReceiverMock");
    this.erc721NonReceiverInstance = await erc721NonReceiverFactory.deploy();

    this.contractInstance = this.erc721Instance;
  });

  shouldHaveRole(DEFAULT_ADMIN_ROLE, MINTER_ROLE);
  // shouldGetTokenURI();
  // shouldSetBaseURI();
  shouldMint();
  shouldSafeMint();

  describe("mintCommon", function () {
    it("should mint to wallet", async function () {
      const tx = this.erc721Instance.connect(this.receiver).mint(this.receiver.address);
      await expect(tx).to.be.revertedWith("MethodNotSupported");
    });
  });
});
