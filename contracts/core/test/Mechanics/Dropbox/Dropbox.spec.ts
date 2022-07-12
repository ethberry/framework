import { expect } from "chai";
import { ethers } from "hardhat";
import { Network } from "@ethersproject/networks";

import { DropboxTest, ERC721Simple, Marketplace } from "../../../typechain-types";
import {
  amount,
  baseTokenURI,
  DEFAULT_ADMIN_ROLE,
  MINTER_ROLE,
  nonce,
  royalty,
  tokenId,
  tokenName,
  tokenSymbol,
} from "../../constants";
import { shouldHaveRole } from "../../shared/AccessControl/hasRoles";
import { shouldGetTokenURI } from "../../ERC721/shared/tokenURI";
import { shouldSetBaseURI } from "../../ERC721/shared/setBaseURI";

describe("Dropbox", function () {
  let marketplaceInstance: Marketplace;
  let erc721Instance: ERC721Simple;
  let dropboxInstance: DropboxTest;
  let network: Network;

  beforeEach(async function () {
    [this.owner, this.receiver] = await ethers.getSigners();

    const marketplaceFactory = await ethers.getContractFactory("Marketplace");
    marketplaceInstance = await marketplaceFactory.deploy(tokenName);
    const itemFactory = await ethers.getContractFactory("ERC721Simple");
    erc721Instance = await itemFactory.deploy(tokenName, tokenSymbol, royalty, baseTokenURI);
    const dropboxFactory = await ethers.getContractFactory("DropboxTest");
    dropboxInstance = await dropboxFactory.deploy(tokenName, tokenSymbol, royalty, baseTokenURI);

    await erc721Instance.grantRole(MINTER_ROLE, marketplaceInstance.address);
    await dropboxInstance.grantRole(MINTER_ROLE, marketplaceInstance.address);

    network = await ethers.provider.getNetwork();

    this.contractInstance = dropboxInstance;
  });

  shouldHaveRole(DEFAULT_ADMIN_ROLE, MINTER_ROLE);
  shouldGetTokenURI();
  shouldSetBaseURI();

  describe("unpack", function () {
    it("should unpack", async function () {
      const signature = await this.owner._signTypedData(
        // Domain
        {
          name: tokenName,
          version: "1.0.0",
          chainId: network.chainId,
          verifyingContract: marketplaceInstance.address,
        },
        // Types
        {
          EIP712: [
            { name: "nonce", type: "bytes32" },
            { name: "item", type: "Asset" },
            { name: "price", type: "Asset" },
          ],
          Asset: [
            { name: "tokenType", type: "uint256" },
            { name: "token", type: "address" },
            { name: "tokenId", type: "uint256" },
            { name: "amount", type: "uint256" },
          ],
        },
        // Value
        {
          nonce,
          item: {
            tokenType: 2,
            token: dropboxInstance.address,
            tokenId,
            amount: 1,
          },
          price: {
            tokenType: 0,
            token: ethers.constants.AddressZero,
            tokenId,
            amount,
          },
        },
      );

      const tx1 = marketplaceInstance.connect(this.receiver).purchaseDropbox(
        nonce,
        {
          tokenType: 2,
          token: dropboxInstance.address,
          tokenId,
          amount: 1,
        },
        {
          tokenType: 0,
          token: ethers.constants.AddressZero,
          tokenId,
          amount,
        },
        this.owner.address,
        signature,
        {
          value: amount,
        },
      );

      await expect(tx1)
        .to.emit(dropboxInstance, "Transfer")
        .withArgs(ethers.constants.AddressZero, this.receiver.address, tokenId);

      // const tx2 = dropboxInstance.connect(receiver).unpack(erc721Instance.address, tokenId);
      // await expect(tx2).to.not.reverted;
    });
  });
});
