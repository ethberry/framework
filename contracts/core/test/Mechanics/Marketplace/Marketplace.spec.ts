import { expect } from "chai";
import { ethers } from "hardhat";
import { Network } from "@ethersproject/networks";

import { Marketplace, ERC1155Simple, ERC721Simple, ERC20Simple } from "../../../typechain-types";
import {
  amount,
  baseTokenURI,
  DEFAULT_ADMIN_ROLE,
  MINTER_ROLE,
  nonce,
  PAUSER_ROLE,
  tokenId,
  tokenName,
  tokenSymbol,
  royalty,
} from "../../constants";
import { shouldHaveRole } from "../../shared/AccessControl/hasRoles";

describe("Marketplace", function () {
  let marketplaceInstance: Marketplace;
  let erc20Instance: ERC20Simple;
  let erc721Instance: ERC721Simple;
  let erc1155Instance: ERC1155Simple;
  let network: Network;

  beforeEach(async function () {
    [this.owner, this.receiver] = await ethers.getSigners();

    const marketplaceFactory = await ethers.getContractFactory("Marketplace");
    marketplaceInstance = await marketplaceFactory.deploy(tokenName);

    const erc20Factory = await ethers.getContractFactory("ERC20Simple");
    erc20Instance = await erc20Factory.deploy(tokenName, tokenSymbol, amount);
    // await erc20Instance.grantRole(MINTER_ROLE, marketplaceInstance.address);

    const erc721Factory = await ethers.getContractFactory("ERC721Simple");
    erc721Instance = await erc721Factory.deploy(tokenName, tokenSymbol, royalty, baseTokenURI);
    await erc721Instance.grantRole(MINTER_ROLE, marketplaceInstance.address);

    const erc1155Factory = await ethers.getContractFactory("ERC1155Simple");
    erc1155Instance = await erc1155Factory.deploy(baseTokenURI);
    await erc1155Instance.grantRole(MINTER_ROLE, marketplaceInstance.address);

    network = await ethers.provider.getNetwork();

    this.contractInstance = marketplaceInstance;
  });

  shouldHaveRole(DEFAULT_ADMIN_ROLE, PAUSER_ROLE);

  describe("purchaseCommon", function () {
    describe("NATIVE > ERC721", function () {
      it("should purchase", async function () {
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
              token: erc721Instance.address,
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

        const tx1 = marketplaceInstance.connect(this.receiver).purchaseCommon(
          nonce,
          {
            tokenType: 2,
            token: erc721Instance.address,
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
          .to.changeEtherBalance(this.receiver, -amount)
          .to.emit(marketplaceInstance, "RedeemCommon")
          .withArgs(
            this.receiver.address,
            [2, erc721Instance.address, tokenId, 1],
            [0, ethers.constants.AddressZero, tokenId, amount],
          )
          .to.emit(erc721Instance, "Transfer")
          .withArgs(ethers.constants.AddressZero, this.receiver.address, tokenId);
      });

      it("should fail: Wrong amount", async function () {
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
              token: erc721Instance.address,
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

        const tx1 = marketplaceInstance.connect(this.receiver).purchaseCommon(
          nonce,
          {
            tokenType: 2,
            token: erc721Instance.address,
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
            value: 0,
          },
        );

        await expect(tx1).to.be.revertedWith(`Marketplace: Wrong amount`);
      });
    });

    describe("ERC20 > ERC721", function () {
      it("should purchase", async function () {
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
              token: erc721Instance.address,
              tokenId,
              amount: 1,
            },
            price: {
              tokenType: 1,
              token: erc20Instance.address,
              tokenId,
              amount,
            },
          },
        );

        await erc20Instance.mint(this.receiver.address, amount);
        await erc20Instance.connect(this.receiver).approve(marketplaceInstance.address, amount);

        const tx1 = marketplaceInstance.connect(this.receiver).purchaseCommon(
          nonce,
          {
            tokenType: 2,
            token: erc721Instance.address,
            tokenId,
            amount: 1,
          },
          {
            tokenType: 1,
            token: erc20Instance.address,
            tokenId,
            amount,
          },
          this.owner.address,
          signature,
        );

        await expect(tx1)
          .to.emit(marketplaceInstance, "RedeemCommon")
          .withArgs(
            this.receiver.address,
            [2, erc721Instance.address, tokenId, 1],
            [1, erc20Instance.address, tokenId, amount],
          )
          .to.emit(erc721Instance, "Transfer")
          .withArgs(ethers.constants.AddressZero, this.receiver.address, tokenId)
          .to.emit(erc20Instance, "Transfer")
          .withArgs(this.receiver.address, marketplaceInstance.address, amount);
      });

      it("should fail: insufficient allowance", async function () {
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
              token: erc721Instance.address,
              tokenId,
              amount: 1,
            },
            price: {
              tokenType: 1,
              token: erc20Instance.address,
              tokenId,
              amount,
            },
          },
        );

        await erc20Instance.mint(this.receiver.address, amount);
        // await erc20Instance.connect(this.receiver).approve(marketplaceInstance.address, amount);

        const tx1 = marketplaceInstance.connect(this.receiver).purchaseCommon(
          nonce,
          {
            tokenType: 2,
            token: erc721Instance.address,
            tokenId,
            amount: 1,
          },
          {
            tokenType: 1,
            token: erc20Instance.address,
            tokenId,
            amount,
          },
          this.owner.address,
          signature,
        );

        await expect(tx1).to.be.revertedWith(`ERC20: insufficient allowance`);
      });

      it("should fail: transfer amount exceeds balance", async function () {
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
              token: erc721Instance.address,
              tokenId,
              amount: 1,
            },
            price: {
              tokenType: 1,
              token: erc20Instance.address,
              tokenId,
              amount,
            },
          },
        );

        // await erc20Instance.mint(this.receiver.address, amount);
        await erc20Instance.connect(this.receiver).approve(marketplaceInstance.address, amount);

        const tx1 = marketplaceInstance.connect(this.receiver).purchaseCommon(
          nonce,
          {
            tokenType: 2,
            token: erc721Instance.address,
            tokenId,
            amount: 1,
          },
          {
            tokenType: 1,
            token: erc20Instance.address,
            tokenId,
            amount,
          },
          this.owner.address,
          signature,
        );

        await expect(tx1).to.be.revertedWith(`ERC20: transfer amount exceeds balance`);
      });
    });

    describe("ERC1155 > ERC721", function () {
      it("should purchase", async function () {
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
              token: erc721Instance.address,
              tokenId,
              amount: 1,
            },
            price: {
              tokenType: 4,
              token: erc1155Instance.address,
              tokenId,
              amount,
            },
          },
        );

        await erc1155Instance.mint(this.receiver.address, tokenId, amount, "0x");
        await erc1155Instance.connect(this.receiver).setApprovalForAll(marketplaceInstance.address, true);

        const tx1 = marketplaceInstance.connect(this.receiver).purchaseCommon(
          nonce,
          {
            tokenType: 2,
            token: erc721Instance.address,
            tokenId,
            amount: 1,
          },
          {
            tokenType: 4,
            token: erc1155Instance.address,
            tokenId,
            amount,
          },
          this.owner.address,
          signature,
        );

        await expect(tx1)
          .to.emit(marketplaceInstance, "RedeemCommon")
          .withArgs(
            this.receiver.address,
            [2, erc721Instance.address, tokenId, 1],
            [4, erc1155Instance.address, tokenId, amount],
          )
          .to.emit(erc721Instance, "Transfer")
          .withArgs(ethers.constants.AddressZero, this.receiver.address, tokenId)
          .to.emit(erc1155Instance, "TransferSingle")
          .withArgs(marketplaceInstance.address, this.receiver.address, marketplaceInstance.address, tokenId, amount);
      });

      it("should fail: caller is not token owner nor approved", async function () {
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
              token: erc721Instance.address,
              tokenId,
              amount: 1,
            },
            price: {
              tokenType: 4,
              token: erc1155Instance.address,
              tokenId,
              amount,
            },
          },
        );

        await erc1155Instance.mint(this.receiver.address, tokenId, amount, "0x");
        // await erc1155Instance.connect(this.receiver).setApprovalForAll(marketplaceInstance.address, true);

        const tx1 = marketplaceInstance.connect(this.receiver).purchaseCommon(
          nonce,
          {
            tokenType: 2,
            token: erc721Instance.address,
            tokenId,
            amount: 1,
          },
          {
            tokenType: 4,
            token: erc1155Instance.address,
            tokenId,
            amount,
          },
          this.owner.address,
          signature,
        );

        await expect(tx1).to.be.revertedWith(`ERC1155: caller is not token owner nor approved`);
      });

      it("should fail: insufficient balance for transfer", async function () {
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
              token: erc721Instance.address,
              tokenId,
              amount: 1,
            },
            price: {
              tokenType: 4,
              token: erc1155Instance.address,
              tokenId,
              amount,
            },
          },
        );

        // await erc1155Instance.mint(this.receiver.address, tokenId, amount, "0x");
        await erc1155Instance.connect(this.receiver).setApprovalForAll(marketplaceInstance.address, true);

        const tx1 = marketplaceInstance.connect(this.receiver).purchaseCommon(
          nonce,
          {
            tokenType: 2,
            token: erc721Instance.address,
            tokenId,
            amount: 1,
          },
          {
            tokenType: 4,
            token: erc1155Instance.address,
            tokenId,
            amount,
          },
          this.owner.address,
          signature,
        );

        await expect(tx1).to.be.revertedWith(`ERC1155: insufficient balance for transfer`);
      });
    });

    describe("NATIVE > ERC1155", function () {
      it("should purchase", async function () {
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
              tokenType: 4,
              token: erc1155Instance.address,
              tokenId,
              amount,
            },
            price: {
              tokenType: 0,
              token: ethers.constants.AddressZero,
              tokenId,
              amount,
            },
          },
        );

        const tx1 = marketplaceInstance.connect(this.receiver).purchaseCommon(
          nonce,
          {
            tokenType: 4,
            token: erc1155Instance.address,
            tokenId,
            amount,
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
          .to.changeEtherBalance(this.receiver, -amount)
          .to.emit(marketplaceInstance, "RedeemCommon")
          .withArgs(
            this.receiver.address,
            [4, erc1155Instance.address, tokenId, amount],
            [0, ethers.constants.AddressZero, tokenId, amount],
          )
          .to.emit(erc1155Instance, "TransferSingle")
          .withArgs(marketplaceInstance.address, ethers.constants.AddressZero, this.receiver.address, tokenId, amount);
      });

      it("should fail: Wrong amount", async function () {
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
              tokenType: 4,
              token: erc1155Instance.address,
              tokenId,
              amount,
            },
            price: {
              tokenType: 0,
              token: ethers.constants.AddressZero,
              tokenId,
              amount,
            },
          },
        );

        const tx1 = marketplaceInstance.connect(this.receiver).purchaseCommon(
          nonce,
          {
            tokenType: 4,
            token: erc1155Instance.address,
            tokenId,
            amount,
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
            value: 0,
          },
        );

        await expect(tx1).to.be.revertedWith(`Marketplace: Wrong amount`);
      });
    });

    describe("ERC20 > ERC1155", function () {
      it("should purchase", async function () {
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
              tokenType: 4,
              token: erc1155Instance.address,
              tokenId,
              amount,
            },
            price: {
              tokenType: 1,
              token: erc20Instance.address,
              tokenId,
              amount,
            },
          },
        );

        await erc20Instance.mint(this.receiver.address, amount);
        await erc20Instance.connect(this.receiver).approve(marketplaceInstance.address, amount);

        const tx1 = marketplaceInstance.connect(this.receiver).purchaseCommon(
          nonce,
          {
            tokenType: 4,
            token: erc1155Instance.address,
            tokenId,
            amount,
          },
          {
            tokenType: 1,
            token: erc20Instance.address,
            tokenId,
            amount,
          },
          this.owner.address,
          signature,
        );

        await expect(tx1)
          .to.emit(marketplaceInstance, "RedeemCommon")
          .withArgs(
            this.receiver.address,
            [2, erc1155Instance.address, tokenId, amount],
            [1, erc20Instance.address, tokenId, amount],
          )
          .to.emit(erc1155Instance, "TransferSingle")
          .withArgs(marketplaceInstance.address, ethers.constants.AddressZero, this.receiver.address, tokenId, amount)
          .to.emit(erc20Instance, "Transfer")
          .withArgs(this.receiver.address, marketplaceInstance.address, amount);
      });

      it("should fail: insufficient allowance", async function () {
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
              tokenType: 4,
              token: erc1155Instance.address,
              tokenId,
              amount,
            },
            price: {
              tokenType: 1,
              token: erc20Instance.address,
              tokenId,
              amount,
            },
          },
        );

        await erc20Instance.mint(this.receiver.address, amount);
        // await erc20Instance.connect(this.receiver).approve(marketplaceInstance.address, amount);

        const tx1 = marketplaceInstance.connect(this.receiver).purchaseCommon(
          nonce,
          {
            tokenType: 4,
            token: erc1155Instance.address,
            tokenId,
            amount,
          },
          {
            tokenType: 1,
            token: erc20Instance.address,
            tokenId,
            amount,
          },
          this.owner.address,
          signature,
        );

        await expect(tx1).to.be.revertedWith(`ERC20: insufficient allowance`);
      });

      it("should fail: transfer amount exceeds balance", async function () {
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
              tokenType: 4,
              token: erc1155Instance.address,
              tokenId,
              amount,
            },
            price: {
              tokenType: 1,
              token: erc20Instance.address,
              tokenId,
              amount,
            },
          },
        );

        // await erc20Instance.mint(this.receiver.address, amount);
        await erc20Instance.connect(this.receiver).approve(marketplaceInstance.address, amount);

        const tx1 = marketplaceInstance.connect(this.receiver).purchaseCommon(
          nonce,
          {
            tokenType: 4,
            token: erc1155Instance.address,
            tokenId,
            amount,
          },
          {
            tokenType: 1,
            token: erc20Instance.address,
            tokenId,
            amount,
          },
          this.owner.address,
          signature,
        );

        await expect(tx1).to.be.revertedWith(`ERC20: transfer amount exceeds balance`);
      });
    });

    describe("ERC1155 > ERC1155", function () {
      it("should purchase", async function () {
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
              tokenType: 4,
              token: erc1155Instance.address,
              tokenId: 1,
              amount,
            },
            price: {
              tokenType: 4,
              token: erc1155Instance.address,
              tokenId: 2,
              amount,
            },
          },
        );

        await erc1155Instance.mint(this.receiver.address, 2, amount, "0x");
        await erc1155Instance.connect(this.receiver).setApprovalForAll(marketplaceInstance.address, true);

        const tx1 = marketplaceInstance.connect(this.receiver).purchaseCommon(
          nonce,
          {
            tokenType: 4,
            token: erc1155Instance.address,
            tokenId: 1,
            amount,
          },
          {
            tokenType: 4,
            token: erc1155Instance.address,
            tokenId: 2,
            amount,
          },
          this.owner.address,
          signature,
        );

        await expect(tx1)
          .to.emit(marketplaceInstance, "RedeemCommon")
          .withArgs(
            this.receiver.address,
            [4, erc1155Instance.address, 1, amount],
            [4, erc1155Instance.address, 2, amount],
          )
          .to.emit(erc1155Instance, "TransferSingle")
          .withArgs(marketplaceInstance.address, ethers.constants.AddressZero, this.receiver.address, 1, amount)
          .to.emit(erc1155Instance, "TransferSingle")
          .withArgs(marketplaceInstance.address, this.receiver.address, marketplaceInstance.address, 2, amount);
      });

      it("should fail: caller is not token owner nor approved", async function () {
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
              tokenType: 4,
              token: erc1155Instance.address,
              tokenId: 1,
              amount,
            },
            price: {
              tokenType: 4,
              token: erc1155Instance.address,
              tokenId: 2,
              amount,
            },
          },
        );

        await erc1155Instance.mint(this.receiver.address, 2, amount, "0x");
        // await erc1155Instance.connect(this.receiver).setApprovalForAll(marketplaceInstance.address, true);

        const tx1 = marketplaceInstance.connect(this.receiver).purchaseCommon(
          nonce,
          {
            tokenType: 4,
            token: erc1155Instance.address,
            tokenId: 1,
            amount,
          },
          {
            tokenType: 4,
            token: erc1155Instance.address,
            tokenId: 2,
            amount,
          },
          this.owner.address,
          signature,
        );

        await expect(tx1).to.be.revertedWith(`ERC1155: caller is not token owner nor approved`);
      });

      it("should fail: insufficient balance for transfer", async function () {
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
              tokenType: 4,
              token: erc1155Instance.address,
              tokenId: 1,
              amount,
            },
            price: {
              tokenType: 4,
              token: erc1155Instance.address,
              tokenId: 2,
              amount,
            },
          },
        );

        // await erc1155Instance.mint(this.receiver.address, 2, amount, "0x");
        await erc1155Instance.connect(this.receiver).setApprovalForAll(marketplaceInstance.address, true);

        const tx1 = marketplaceInstance.connect(this.receiver).purchaseCommon(
          nonce,
          {
            tokenType: 4,
            token: erc1155Instance.address,
            tokenId: 1,
            amount,
          },
          {
            tokenType: 4,
            token: erc1155Instance.address,
            tokenId: 2,
            amount,
          },
          this.owner.address,
          signature,
        );

        await expect(tx1).to.be.revertedWith(`ERC1155: insufficient balance for transfer`);
      });
    });
  });
});
