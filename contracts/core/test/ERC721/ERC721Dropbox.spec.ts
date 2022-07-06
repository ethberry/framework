import { expect } from "chai";
import { ethers } from "hardhat";
import { Network } from "@ethersproject/networks";
import {
  amount,
  baseTokenURI,
  DEFAULT_ADMIN_ROLE,
  MINTER_ROLE,
  nonce,
  royalty,
  templateId,
  tokenId,
  tokenName,
  tokenSymbol,
} from "../constants";
import { shouldHaveRole } from "../shared/AccessControl/hasRoles";

describe("ERC721Dropbox", function () {
  let network: Network;

  beforeEach(async function () {
    [this.owner, this.receiver] = await ethers.getSigners();

    const marketplaceFactory = await ethers.getContractFactory("ERC721Marketplace");
    this.marketplaceInstance = await marketplaceFactory.deploy(tokenName);
    const itemFactory = await ethers.getContractFactory("ERC721Simple");
    this.itemInstance = await itemFactory.deploy(tokenName, tokenSymbol, royalty, baseTokenURI);
    const dropboxFactory = await ethers.getContractFactory("ERC721Dropbox");
    this.erc721Instance = await dropboxFactory.deploy(tokenName, tokenSymbol, royalty, baseTokenURI);

    await this.itemInstance.grantRole(MINTER_ROLE, this.marketplaceInstance.address);
    await this.erc721Instance.grantRole(MINTER_ROLE, this.marketplaceInstance.address);

    network = await ethers.provider.getNetwork();

    this.contractInstance = this.erc721Instance;
  });

  shouldHaveRole(DEFAULT_ADMIN_ROLE, MINTER_ROLE);
  // commented out because it has no mintCommon function, instead it has mintDropbox
  // shouldGetTokenURI();
  // shouldSetBaseURI();

  describe("unpack", function () {
    it("should unpack", async function () {
      const signature = await this.owner._signTypedData(
        // Domain
        {
          name: tokenName,
          version: "1.0.0",
          chainId: network.chainId,
          verifyingContract: this.marketplaceInstance.address,
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
          collection: this.erc721Instance.address,
          templateId,
          price: amount,
        },
      );

      const tx1 = this.marketplaceInstance
        .connect(this.receiver)
        .buyDropbox(nonce, this.erc721Instance.address, templateId, this.owner.address, signature, { value: amount });
      await expect(tx1)
        .to.emit(this.erc721Instance, "Transfer")
        .withArgs(ethers.constants.AddressZero, this.receiver.address, tokenId);

      // const tx2 = erc721Instance.connect(receiver).unpack(itemInstance.address, tokenId);
      // await expect(tx2).to.not.reverted;
    });
  });
});
