import { expect } from "chai";
import { ethers } from "hardhat";

import { baseTokenURI, DEFAULT_ADMIN_ROLE, MINTER_ROLE, royalty, tokenName, tokenSymbol } from "../constants";
import { shouldHaveRole } from "../shared/accessControl/hasRoles";
import { shouldGetTokenURI } from "./shared/tokenURI";
import { shouldSetBaseURI } from "./shared/setBaseURI";
import { shouldBlacklist } from "../shared/blacklist";

describe("ERC721Full", function () {
  beforeEach(async function () {
    [this.owner, this.receiver] = await ethers.getSigners();

    const erc721Factory = await ethers.getContractFactory("ERC721Full");
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

  describe("mint", function () {
    it("should fail: this method is not supported", async function () {
      const tx = this.erc721Instance.connect(this.receiver).mint(this.receiver.address);
      await expect(tx).to.be.revertedWith("ERC721Simple: this method is not supported");
    });
  });

  describe("safeMint", function () {
    it("should fail: this method is not supported", async function () {
      const tx = this.erc721Instance.connect(this.receiver).safeMint(this.receiver.address);
      await expect(tx).to.be.revertedWith("ERC721Simple: this method is not supported");
    });
  });
});
