import { expect } from "chai";
import { ethers } from "hardhat";
import { ContractFactory } from "ethers";
import { Network } from "@ethersproject/networks";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { DropboxERC721, Item, MarketplaceERC721 } from "../../typechain-types";
import {
  amount,
  baseTokenURI,
  DEFAULT_ADMIN_ROLE,
  MINTER_ROLE,
  nonce,
  royaltyNumerator,
  templateId,
  tokenId,
  tokenName,
  tokenSymbol,
} from "../constants";

describe("DropboxERC721", function () {
  let marketplace: ContractFactory;
  let marketplaceInstance: MarketplaceERC721;
  let item: ContractFactory;
  let itemInstance: Item;
  let dropbox: ContractFactory;
  let dropboxInstance: DropboxERC721;
  let owner: SignerWithAddress;
  let receiver: SignerWithAddress;
  let network: Network;

  beforeEach(async function () {
    [owner, receiver] = await ethers.getSigners();

    marketplace = await ethers.getContractFactory("MarketplaceERC721");
    marketplaceInstance = (await marketplace.deploy(tokenName)) as MarketplaceERC721;
    item = await ethers.getContractFactory("Item");
    itemInstance = (await item.deploy(tokenName, tokenSymbol, baseTokenURI, royaltyNumerator)) as Item;
    dropbox = await ethers.getContractFactory("DropboxERC721");
    dropboxInstance = (await dropbox.deploy(tokenName, tokenSymbol, baseTokenURI, royaltyNumerator)) as DropboxERC721;

    await itemInstance.grantRole(MINTER_ROLE, marketplaceInstance.address);
    await dropboxInstance.grantRole(MINTER_ROLE, marketplaceInstance.address);

    network = await ethers.provider.getNetwork();
  });

  describe("hasRole", function () {
    it("Should set the right roles to deployer", async function () {
      const isAdmin = await itemInstance.hasRole(DEFAULT_ADMIN_ROLE, owner.address);
      expect(isAdmin).to.equal(true);
      const isMinter = await itemInstance.hasRole(MINTER_ROLE, owner.address);
      expect(isMinter).to.equal(true);
    });
  });

  describe("unpack", function () {
    it("should unpack", async function () {
      await itemInstance.setMaxTemplateId(2);

      const signature = await owner._signTypedData(
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
            { name: "collection", type: "address" },
            { name: "templateId", type: "uint256" },
            { name: "price", type: "uint256" },
          ],
        },
        // Value
        {
          nonce,
          collection: dropboxInstance.address,
          templateId,
          price: amount,
        },
      );

      const tx1 = marketplaceInstance
        .connect(receiver)
        .buyDropbox(nonce, dropboxInstance.address, templateId, owner.address, signature, { value: amount });
      await expect(tx1)
        .to.emit(dropboxInstance, "Transfer")
        .withArgs(ethers.constants.AddressZero, receiver.address, tokenId);

      // const tx2 = dropboxInstance.connect(receiver).unpack(itemInstance.address, tokenId);
      // await expect(tx2).to.not.reverted;
    });
  });
});
