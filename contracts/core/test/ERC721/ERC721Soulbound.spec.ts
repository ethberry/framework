import { expect } from "chai";
import { ethers } from "hardhat";

import {
  baseTokenURI,
  DEFAULT_ADMIN_ROLE,
  MINTER_ROLE,
  royalty,
  templateId,
  tokenId,
  tokenName,
  tokenSymbol,
} from "../constants";
import { shouldHaveRole } from "../shared/accessControl/hasRoles";
import { shouldGetTokenURI } from "./shared/tokenURI";
import { shouldSetBaseURI } from "./shared/setBaseURI";
import { shouldMint } from "./shared/mint";
import { shouldMintCommon } from "./shared/mintCommon";
import { shouldSafeMint } from "./shared/safeMint";

describe("ERC721SoulBound", function () {
  beforeEach(async function () {
    [this.owner, this.receiver] = await ethers.getSigners();

    const erc721Factory = await ethers.getContractFactory("ERC721SoulBound");
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

  shouldMintCommon();
  shouldMint();
  shouldSafeMint();

  describe("transferFrom", function () {
    it("should fail: can't be transferred", async function () {
      await this.erc721Instance.mintCommon(this.owner.address, templateId);
      const tx = this.erc721Instance.transferFrom(this.owner.address, this.receiver.address, tokenId);

      await expect(tx).to.be.revertedWith("ERC721SoulBound: can't be transferred");
    });
  });
});
