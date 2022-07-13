import { expect } from "chai";
import { ethers } from "hardhat";

import { DropboxTest } from "../../../typechain-types";
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

describe("Dropbox", function () {
  let dropboxInstance: DropboxTest;

  beforeEach(async function () {
    [this.owner, this.receiver] = await ethers.getSigners();

    const dropboxFactory = await ethers.getContractFactory("DropboxTest");
    dropboxInstance = await dropboxFactory.deploy(tokenName, tokenSymbol, royalty, baseTokenURI);

    this.contractInstance = dropboxInstance;
  });

  shouldHaveRole(DEFAULT_ADMIN_ROLE, MINTER_ROLE);
  shouldGetTokenURI();
  shouldSetBaseURI();

  describe("mint", function () {
    it("should mint", async function () {
      const tx1 = dropboxInstance.mintDropbox(this.receiver.address, tokenId);

      await expect(tx1)
        .to.emit(dropboxInstance, "Transfer")
        .withArgs(ethers.constants.AddressZero, this.receiver.address, tokenId);
    });
  });

  // TODO unpack
});
