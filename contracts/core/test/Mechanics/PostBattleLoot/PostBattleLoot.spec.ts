import { expect } from "chai";
import { ethers } from "hardhat";
import { Network } from "@ethersproject/networks";

import { ERC1155Simple, PostBattleLoot } from "../../../typechain-types";
import {
  amount,
  baseTokenURI,
  DEFAULT_ADMIN_ROLE,
  MINTER_ROLE,
  nonce,
  PAUSER_ROLE,
  tokenId,
  tokenName,
} from "../../constants";
import { shouldHaveRole } from "../../shared/AccessControl/hasRoles";

describe("PostBattleLoot", function () {
  let pblInstance: PostBattleLoot;
  let erc1155Instance: ERC1155Simple;
  let network: Network;

  beforeEach(async function () {
    [this.owner, this.receiver] = await ethers.getSigners();

    const pblFactory = await ethers.getContractFactory("PostBattleLoot");
    pblInstance = await pblFactory.deploy(tokenName);
    const erc1155Factory = await ethers.getContractFactory("ERC1155Simple");
    erc1155Instance = await erc1155Factory.deploy(baseTokenURI);

    await erc1155Instance.grantRole(MINTER_ROLE, pblInstance.address);

    network = await ethers.provider.getNetwork();

    this.contractInstance = pblInstance;
  });

  shouldHaveRole(DEFAULT_ADMIN_ROLE, PAUSER_ROLE);

  describe("redeem", function () {
    it("should redeem", async function () {
      const signature = await this.owner._signTypedData(
        // Domain
        {
          name: tokenName,
          version: "1.0.0",
          chainId: network.chainId,
          verifyingContract: pblInstance.address,
        },
        // Types
        {
          EIP712: [
            { name: "nonce", type: "bytes32" },
            { name: "account", type: "address" },
            { name: "items", type: "Asset[]" },
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
          items: [
            {
              tokenType: 4,
              token: erc1155Instance.address,
              tokenId,
              amount,
            },
          ],
        },
      );

      const tx1 = pblInstance.connect(this.receiver).redeem(
        nonce,
        [
          {
            tokenType: 4,
            token: erc1155Instance.address,
            tokenId,
            amount,
          },
        ],
        this.owner.address,
        signature,
      );

      await expect(tx1).to.emit(pblInstance, "RedeemLoot");
      // https://github.com/TrueFiEng/Waffle/pull/751
      // .withArgs(this.receiver.address, [[4, erc1155Instance.address, tokenId, amount]]);
    });

    it("should fail: duplicate mint", async function () {
      const signature = await this.owner._signTypedData(
        // Domain
        {
          name: tokenName,
          version: "1.0.0",
          chainId: network.chainId,
          verifyingContract: pblInstance.address,
        },
        // Types
        {
          EIP712: [
            { name: "nonce", type: "bytes32" },
            { name: "account", type: "address" },
            { name: "items", type: "Asset[]" },
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
          items: [
            {
              tokenType: 4,
              token: erc1155Instance.address,
              tokenId,
              amount,
            },
          ],
        },
      );

      const tx1 = pblInstance.connect(this.receiver).redeem(
        nonce,
        [
          {
            tokenType: 4,
            token: erc1155Instance.address,
            tokenId,
            amount,
          },
        ],
        this.owner.address,
        signature,
      );

      await expect(tx1).to.emit(pblInstance, "RedeemLoot");

      const tx2 = pblInstance.connect(this.receiver).redeem(
        nonce,
        [
          {
            tokenType: 4,
            token: erc1155Instance.address,
            tokenId,
            amount,
          },
        ],
        this.owner.address,
        signature,
      );
      await expect(tx2).to.be.revertedWith("PostBattleLoot: Expired signature");
    });

    it("should fail for wrong signer role", async function () {
      const signature = await this.owner._signTypedData(
        // Domain
        {
          name: tokenName,
          version: "1.0.0",
          chainId: network.chainId,
          verifyingContract: pblInstance.address,
        },
        // Types
        {
          EIP712: [
            { name: "nonce", type: "bytes32" },
            { name: "account", type: "address" },
            { name: "items", type: "Asset[]" },
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
          items: [
            {
              tokenType: 4,
              token: erc1155Instance.address,
              tokenId,
              amount,
            },
          ],
        },
      );

      const tx1 = pblInstance.connect(this.receiver).redeem(
        nonce,
        [
          {
            tokenType: 4,
            token: erc1155Instance.address,
            tokenId,
            amount,
          },
        ],
        this.receiver.address,
        signature,
      );

      await expect(tx1).to.be.revertedWith(`PostBattleLoot: Wrong signer`);
    });

    it("should fail for wrong signature", async function () {
      const tx = pblInstance.redeem(
        nonce,
        [
          {
            tokenType: 4,
            token: erc1155Instance.address,
            tokenId,
            amount,
          },
        ],
        this.owner.address,
        ethers.utils.formatBytes32String("signature"),
      );

      await expect(tx).to.be.revertedWith(`PostBattleLoot: Invalid signature`);
    });
  });
});
