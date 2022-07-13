import { expect } from "chai";
import { ethers } from "hardhat";
import { Network } from "@ethersproject/networks";

import { ERC721Graded, MetaDataManipulator } from "../../../typechain-types";
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

describe("MetaData", function () {
  let erc721Instance: ERC721Graded;
  let mdmInstance: MetaDataManipulator;
  let network: Network;

  beforeEach(async function () {
    [this.owner, this.receiver] = await ethers.getSigners();

    const mdmFactory = await ethers.getContractFactory("MetaDataManipulator");
    mdmInstance = await mdmFactory.deploy(tokenName);

    const erc721Factory = await ethers.getContractFactory("ERC721Graded");
    erc721Instance = await erc721Factory.deploy(tokenName, tokenSymbol, royalty, baseTokenURI);
    await erc721Instance.grantRole(MINTER_ROLE, mdmInstance.address);

    network = await ethers.provider.getNetwork();

    this.contractInstance = mdmInstance;
  });

  shouldHaveRole(DEFAULT_ADMIN_ROLE, MINTER_ROLE);

  describe("mint", function () {
    it("should mint", async function () {
      const tx1 = erc721Instance.mintCommon(this.receiver.address, tokenId);

      await expect(tx1)
        .to.emit(erc721Instance, "Transfer")
        .withArgs(ethers.constants.AddressZero, this.receiver.address, tokenId);

      const signature = await this.owner._signTypedData(
        // Domain
        {
          name: tokenName,
          version: "1.0.0",
          chainId: network.chainId,
          verifyingContract: mdmInstance.address,
        },
        // Types
        {
          EIP712: [
            { name: "nonce", type: "bytes32" },
            { name: "account", type: "address" },
            { name: "item", type: "Asset" },
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
          account: this.receiver.address,
          item: {
            tokenType: 2,
            token: erc721Instance.address,
            tokenId,
            amount,
          },
        },
      );

      const tx2 = mdmInstance.connect(this.receiver).levelUp(
        nonce,
        {
          tokenType: 2,
          token: erc721Instance.address,
          tokenId,
          amount,
        },
        this.owner.address,
        signature,
      );

      await expect(tx2).to.emit(erc721Instance, "LevelUp").withArgs(mdmInstance.address, tokenId, 2);
    });
  });
});
