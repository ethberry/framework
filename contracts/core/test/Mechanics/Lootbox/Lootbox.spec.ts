import { expect } from "chai";
import { ethers } from "hardhat";

import { LootboxTest } from "../../../typechain-types";
import {
  baseTokenURI,
  DEFAULT_ADMIN_ROLE,
  MINTER_ROLE,
  royalty,
  tokenId,
  tokenName,
  tokenSymbol,
} from "../../constants";
import { shouldHaveRole } from "../../shared/AccessControl/hasRoles";
import { shouldGetTokenURI } from "../../ERC721/shared/tokenURI";
import { shouldSetBaseURI } from "../../ERC721/shared/setBaseURI";

describe("Lootbox", function () {
  let lootboxInstance: LootboxTest;

  beforeEach(async function () {
    [this.owner, this.receiver] = await ethers.getSigners();

    const lootboxFactory = await ethers.getContractFactory("LootboxTest");
    lootboxInstance = await lootboxFactory.deploy(tokenName, tokenSymbol, royalty, baseTokenURI);

    this.contractInstance = lootboxInstance;
  });

  shouldHaveRole(DEFAULT_ADMIN_ROLE, MINTER_ROLE);
  shouldGetTokenURI();
  shouldSetBaseURI();

  describe("mint", function () {
    it("should mint", async function () {
      const tx1 = lootboxInstance.mintLootbox(this.receiver.address, tokenId);

      await expect(tx1)
        .to.emit(lootboxInstance, "Transfer")
        .withArgs(ethers.constants.AddressZero, this.receiver.address, tokenId);
    });
  });

  // TODO unpack
});
