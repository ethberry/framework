import { expect } from "chai";
import { ethers } from "hardhat";
import { Network } from "@ethersproject/networks";

import { ERC1155Simple, ERC20Simple, ERC721Simple, Exchange, ERC721Lootbox } from "../../../typechain-types";
import {
  amount,
  baseTokenURI,
  DEFAULT_ADMIN_ROLE,
  MINTER_ROLE,
  nonce,
  PAUSER_ROLE,
  royalty,
  tokenId,
  tokenName,
  tokenSymbol,
} from "../../constants";
import { shouldHaveRole } from "../../shared/AccessControl/hasRoles";

describe("Exchange", function () {
  let exchangeInstance: Exchange;
  let erc20Instance: ERC20Simple;
  let erc721Instance: ERC721Simple;
  let erc1155Instance: ERC1155Simple;
  let lootboxInstance: ERC721Lootbox;
  let network: Network;

  beforeEach(async function () {
    [this.owner, this.receiver] = await ethers.getSigners();

    const exchangeFactory = await ethers.getContractFactory("Exchange");
    exchangeInstance = await exchangeFactory.deploy(tokenName);

    const erc20Factory = await ethers.getContractFactory("ERC20Simple");
    erc20Instance = await erc20Factory.deploy(tokenName, tokenSymbol, amount);
    // await erc20Instance.grantRole(MINTER_ROLE, exchangeInstance.address);

    const erc721Factory = await ethers.getContractFactory("ERC721Simple");
    erc721Instance = await erc721Factory.deploy(tokenName, tokenSymbol, royalty, baseTokenURI);
    await erc721Instance.grantRole(MINTER_ROLE, exchangeInstance.address);

    const erc1155Factory = await ethers.getContractFactory("ERC1155Simple");
    erc1155Instance = await erc1155Factory.deploy(baseTokenURI);
    await erc1155Instance.grantRole(MINTER_ROLE, exchangeInstance.address);

    const lootboxFactory = await ethers.getContractFactory("ERC721Lootbox");
    lootboxInstance = await lootboxFactory.deploy(tokenName, tokenSymbol, royalty, baseTokenURI);
    await lootboxInstance.grantRole(MINTER_ROLE, exchangeInstance.address);

    network = await ethers.provider.getNetwork();

    this.contractInstance = exchangeInstance;
  });

  shouldHaveRole(DEFAULT_ADMIN_ROLE, PAUSER_ROLE);

  describe("execute", function () {
    describe("NULL > NULL", function () {
      it("NULL > NULL", async function () {
        const signature = await this.owner._signTypedData(
          // Domain
          {
            name: tokenName,
            version: "1.0.0",
            chainId: network.chainId,
            verifyingContract: exchangeInstance.address,
          },
          // Types
          {
            EIP712: [
              { name: "nonce", type: "bytes32" },
              { name: "account", type: "address" },
              { name: "items", type: "Asset[]" },
              { name: "ingredients", type: "Asset[]" },
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
            items: [],
            ingredients: [],
          },
        );

        const tx1 = exchangeInstance.connect(this.receiver).execute(nonce, [], [], this.owner.address, signature);

        await expect(tx1).to.emit(exchangeInstance, "Transaction");
        // https://github.com/TrueFiEng/Waffle/pull/751
        // .withArgs(this.receiver.address, [[4, erc1155Instance.address, tokenId, amount]]);
      });
    });

    describe("NULL > ERC721", function () {
      it("should execute", async function () {
        const signature = await this.owner._signTypedData(
          // Domain
          {
            name: tokenName,
            version: "1.0.0",
            chainId: network.chainId,
            verifyingContract: exchangeInstance.address,
          },
          // Types
          {
            EIP712: [
              { name: "nonce", type: "bytes32" },
              { name: "account", type: "address" },
              { name: "items", type: "Asset[]" },
              { name: "ingredients", type: "Asset[]" },
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
                tokenType: 2,
                token: erc721Instance.address,
                tokenId,
                amount,
              },
            ],
            ingredients: [],
          },
        );

        const tx1 = exchangeInstance.connect(this.receiver).execute(
          nonce,
          [
            {
              tokenType: 2,
              token: erc721Instance.address,
              tokenId,
              amount,
            },
          ],
          [],
          this.owner.address,
          signature,
        );

        await expect(tx1).to.emit(exchangeInstance, "Transaction");
        // https://github.com/TrueFiEng/Waffle/pull/751
        // .withArgs(this.receiver.address, [[4, erc1155Instance.address, tokenId, amount]]);
      });
    });

    describe("NULL > ERC1155", function () {
      it("should execute", async function () {
        const signature = await this.owner._signTypedData(
          // Domain
          {
            name: tokenName,
            version: "1.0.0",
            chainId: network.chainId,
            verifyingContract: exchangeInstance.address,
          },
          // Types
          {
            EIP712: [
              { name: "nonce", type: "bytes32" },
              { name: "account", type: "address" },
              { name: "items", type: "Asset[]" },
              { name: "ingredients", type: "Asset[]" },
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
            ingredients: [],
          },
        );

        const tx1 = exchangeInstance.connect(this.receiver).execute(
          nonce,
          [
            {
              tokenType: 4,
              token: erc1155Instance.address,
              tokenId,
              amount,
            },
          ],
          [],
          this.owner.address,
          signature,
        );

        await expect(tx1).to.emit(exchangeInstance, "Transaction");
        // https://github.com/TrueFiEng/Waffle/pull/751
        // .withArgs(this.receiver.address, [[4, erc1155Instance.address, tokenId, amount]]);
      });
    });

    describe("NATIVE > ERC721", function () {
      it("should execute", async function () {
        const signature = await this.owner._signTypedData(
          // Domain
          {
            name: tokenName,
            version: "1.0.0",
            chainId: network.chainId,
            verifyingContract: exchangeInstance.address,
          },
          // Types
          {
            EIP712: [
              { name: "nonce", type: "bytes32" },
              { name: "account", type: "address" },
              { name: "items", type: "Asset[]" },
              { name: "ingredients", type: "Asset[]" },
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
                tokenType: 2,
                token: erc721Instance.address,
                tokenId,
                amount: 1,
              },
            ],
            ingredients: [
              {
                tokenType: 0,
                token: ethers.constants.AddressZero,
                tokenId,
                amount,
              },
            ],
          },
        );

        const tx1 = exchangeInstance.connect(this.receiver).execute(
          nonce,
          [
            {
              tokenType: 2,
              token: erc721Instance.address,
              tokenId,
              amount: 1,
            },
          ],
          [
            {
              tokenType: 0,
              token: ethers.constants.AddressZero,
              tokenId,
              amount,
            },
          ],
          this.owner.address,
          signature,
          {
            value: amount,
          },
        );

        await expect(tx1)
          .to.changeEtherBalance(this.receiver, -amount)
          .to.emit(exchangeInstance, "Transaction")
          // .withArgs(
          //   this.receiver.address,
          //   [[2, erc721Instance.address, tokenId, 1]],
          //   [[0, ethers.constants.AddressZero, tokenId, amount]],
          // )
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
            verifyingContract: exchangeInstance.address,
          },
          // Types
          {
            EIP712: [
              { name: "nonce", type: "bytes32" },
              { name: "account", type: "address" },
              { name: "items", type: "Asset[]" },
              { name: "ingredients", type: "Asset[]" },
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
                tokenType: 2,
                token: erc721Instance.address,
                tokenId,
                amount: 1,
              },
            ],
            ingredients: [
              {
                tokenType: 0,
                token: ethers.constants.AddressZero,
                tokenId,
                amount,
              },
            ],
          },
        );

        const tx1 = exchangeInstance.connect(this.receiver).execute(
          nonce,
          [
            {
              tokenType: 2,
              token: erc721Instance.address,
              tokenId,
              amount: 1,
            },
          ],
          [
            {
              tokenType: 0,
              token: ethers.constants.AddressZero,
              tokenId,
              amount,
            },
          ],
          this.owner.address,
          signature,
          {
            value: 0,
          },
        );

        await expect(tx1).to.be.revertedWith(`Exchange: Wrong amount`);
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
            verifyingContract: exchangeInstance.address,
          },
          // Types
          {
            EIP712: [
              { name: "nonce", type: "bytes32" },
              { name: "account", type: "address" },
              { name: "items", type: "Asset[]" },
              { name: "ingredients", type: "Asset[]" },
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
                tokenType: 2,
                token: erc721Instance.address,
                tokenId,
                amount: 1,
              },
            ],
            ingredients: [
              {
                tokenType: 1,
                token: erc20Instance.address,
                tokenId,
                amount,
              },
            ],
          },
        );

        await erc20Instance.mint(this.receiver.address, amount);
        await erc20Instance.connect(this.receiver).approve(exchangeInstance.address, amount);

        const tx1 = exchangeInstance.connect(this.receiver).execute(
          nonce,
          [
            {
              tokenType: 2,
              token: erc721Instance.address,
              tokenId,
              amount: 1,
            },
          ],
          [
            {
              tokenType: 1,
              token: erc20Instance.address,
              tokenId,
              amount,
            },
          ],
          this.owner.address,
          signature,
        );

        await expect(tx1)
          .to.emit(exchangeInstance, "Transaction")
          // .withArgs(
          //   this.receiver.address,
          //   [[2, erc721Instance.address, tokenId, 1]],
          //   [[1, erc20Instance.address, tokenId, amount]],
          // )
          .to.emit(erc721Instance, "Transfer")
          .withArgs(ethers.constants.AddressZero, this.receiver.address, tokenId)
          .to.emit(erc20Instance, "Transfer")
          .withArgs(this.receiver.address, exchangeInstance.address, amount);
      });

      it("should fail: insufficient allowance", async function () {
        const signature = await this.owner._signTypedData(
          // Domain
          {
            name: tokenName,
            version: "1.0.0",
            chainId: network.chainId,
            verifyingContract: exchangeInstance.address,
          },
          // Types
          {
            EIP712: [
              { name: "nonce", type: "bytes32" },
              { name: "account", type: "address" },
              { name: "items", type: "Asset[]" },
              { name: "ingredients", type: "Asset[]" },
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
                tokenType: 2,
                token: erc721Instance.address,
                tokenId,
                amount: 1,
              },
            ],
            ingredients: [
              {
                tokenType: 1,
                token: erc20Instance.address,
                tokenId,
                amount,
              },
            ],
          },
        );

        await erc20Instance.mint(this.receiver.address, amount);
        // await erc20Instance.connect(this.receiver).approve(exchangeInstance.address, amount);

        const tx1 = exchangeInstance.connect(this.receiver).execute(
          nonce,
          [
            {
              tokenType: 2,
              token: erc721Instance.address,
              tokenId,
              amount: 1,
            },
          ],
          [
            {
              tokenType: 1,
              token: erc20Instance.address,
              tokenId,
              amount,
            },
          ],
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
            verifyingContract: exchangeInstance.address,
          },
          // Types
          {
            EIP712: [
              { name: "nonce", type: "bytes32" },
              { name: "account", type: "address" },
              { name: "items", type: "Asset[]" },
              { name: "ingredients", type: "Asset[]" },
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
                tokenType: 2,
                token: erc721Instance.address,
                tokenId,
                amount: 1,
              },
            ],
            ingredients: [
              {
                tokenType: 1,
                token: erc20Instance.address,
                tokenId,
                amount,
              },
            ],
          },
        );

        // await erc20Instance.mint(this.receiver.address, amount);
        await erc20Instance.connect(this.receiver).approve(exchangeInstance.address, amount);

        const tx1 = exchangeInstance.connect(this.receiver).execute(
          nonce,
          [
            {
              tokenType: 2,
              token: erc721Instance.address,
              tokenId,
              amount: 1,
            },
          ],
          [
            {
              tokenType: 1,
              token: erc20Instance.address,
              tokenId,
              amount,
            },
          ],
          this.owner.address,
          signature,
        );

        await expect(tx1).to.be.revertedWith(`ERC20: transfer amount exceeds balance`);
      });
    });

    describe("ERC1155 > ERC721", function () {
      it("should execute", async function () {
        const signature = await this.owner._signTypedData(
          // Domain
          {
            name: tokenName,
            version: "1.0.0",
            chainId: network.chainId,
            verifyingContract: exchangeInstance.address,
          },
          // Types
          {
            EIP712: [
              { name: "nonce", type: "bytes32" },
              { name: "account", type: "address" },
              { name: "items", type: "Asset[]" },
              { name: "ingredients", type: "Asset[]" },
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
                tokenType: 2,
                token: erc721Instance.address,
                tokenId,
                amount,
              },
            ],
            ingredients: [
              {
                tokenType: 4,
                token: erc1155Instance.address,
                tokenId,
                amount,
              },
            ],
          },
        );

        await erc1155Instance.mint(this.receiver.address, tokenId, amount, "0x");
        await erc1155Instance.connect(this.receiver).setApprovalForAll(exchangeInstance.address, true);

        const tx1 = exchangeInstance.connect(this.receiver).execute(
          nonce,
          [
            {
              tokenType: 2,
              token: erc721Instance.address,
              tokenId,
              amount,
            },
          ],
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

        await expect(tx1).to.emit(exchangeInstance, "Transaction");
        // https://github.com/TrueFiEng/Waffle/pull/751
        // .withArgs(this.receiver.address, [[4, erc1155Instance.address, tokenId, amount]]);
      });

      it("should fail: caller is not token owner nor approved", async function () {
        const signature = await this.owner._signTypedData(
          // Domain
          {
            name: tokenName,
            version: "1.0.0",
            chainId: network.chainId,
            verifyingContract: exchangeInstance.address,
          },
          // Types
          {
            EIP712: [
              { name: "nonce", type: "bytes32" },
              { name: "account", type: "address" },
              { name: "items", type: "Asset[]" },
              { name: "ingredients", type: "Asset[]" },
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
                tokenType: 2,
                token: erc721Instance.address,
                tokenId,
                amount: 1,
              },
            ],
            ingredients: [
              {
                tokenType: 4,
                token: erc1155Instance.address,
                tokenId,
                amount,
              },
            ],
          },
        );

        await erc1155Instance.mint(this.receiver.address, tokenId, amount, "0x");
        // await erc1155Instance.connect(this.receiver).setApprovalForAll(exchangeInstance.address, true);

        const tx1 = exchangeInstance.connect(this.receiver).execute(
          nonce,
          [
            {
              tokenType: 2,
              token: erc721Instance.address,
              tokenId,
              amount: 1,
            },
          ],
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

        await expect(tx1).to.be.revertedWith(`ERC1155: caller is not token owner nor approved`);
      });

      it("should fail: insufficient balance for transfer", async function () {
        const signature = await this.owner._signTypedData(
          // Domain
          {
            name: tokenName,
            version: "1.0.0",
            chainId: network.chainId,
            verifyingContract: exchangeInstance.address,
          },
          // Types
          {
            EIP712: [
              { name: "nonce", type: "bytes32" },
              { name: "account", type: "address" },
              { name: "items", type: "Asset[]" },
              { name: "ingredients", type: "Asset[]" },
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
                tokenType: 2,
                token: erc721Instance.address,
                tokenId,
                amount: 1,
              },
            ],
            ingredients: [
              {
                tokenType: 4,
                token: erc1155Instance.address,
                tokenId,
                amount,
              },
            ],
          },
        );

        // await erc1155Instance.mint(this.receiver.address, tokenId, amount, "0x");
        await erc1155Instance.connect(this.receiver).setApprovalForAll(exchangeInstance.address, true);

        const tx1 = exchangeInstance.connect(this.receiver).execute(
          nonce,
          [
            {
              tokenType: 2,
              token: erc721Instance.address,
              tokenId,
              amount: 1,
            },
          ],
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
            verifyingContract: exchangeInstance.address,
          },
          // Types
          {
            EIP712: [
              { name: "nonce", type: "bytes32" },
              { name: "account", type: "address" },
              { name: "items", type: "Asset[]" },
              { name: "ingredients", type: "Asset[]" },
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
            ingredients: [
              {
                tokenType: 0,
                token: ethers.constants.AddressZero,
                tokenId,
                amount,
              },
            ],
          },
        );

        const tx1 = exchangeInstance.connect(this.receiver).execute(
          nonce,
          [
            {
              tokenType: 4,
              token: erc1155Instance.address,
              tokenId,
              amount,
            },
          ],
          [
            {
              tokenType: 0,
              token: ethers.constants.AddressZero,
              tokenId,
              amount,
            },
          ],
          this.owner.address,
          signature,
          {
            value: amount,
          },
        );

        await expect(tx1)
          .to.changeEtherBalance(this.receiver, -amount)
          .to.emit(exchangeInstance, "Transaction")
          // .withArgs(
          //   this.receiver.address,
          //   [[4, erc1155Instance.address, tokenId, amount]],
          //   [[0, ethers.constants.AddressZero, tokenId, amount]],
          // )
          .to.emit(erc1155Instance, "TransferSingle")
          .withArgs(exchangeInstance.address, ethers.constants.AddressZero, this.receiver.address, tokenId, amount);
      });

      it("should fail: Wrong amount", async function () {
        const signature = await this.owner._signTypedData(
          // Domain
          {
            name: tokenName,
            version: "1.0.0",
            chainId: network.chainId,
            verifyingContract: exchangeInstance.address,
          },
          // Types
          {
            EIP712: [
              { name: "nonce", type: "bytes32" },
              { name: "account", type: "address" },
              { name: "items", type: "Asset[]" },
              { name: "ingredients", type: "Asset[]" },
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
            ingredients: [
              {
                tokenType: 0,
                token: ethers.constants.AddressZero,
                tokenId,
                amount,
              },
            ],
          },
        );

        const tx1 = exchangeInstance.connect(this.receiver).execute(
          nonce,
          [
            {
              tokenType: 4,
              token: erc1155Instance.address,
              tokenId,
              amount,
            },
          ],
          [
            {
              tokenType: 0,
              token: ethers.constants.AddressZero,
              tokenId,
              amount,
            },
          ],
          this.owner.address,
          signature,
          {
            value: 0,
          },
        );

        await expect(tx1).to.be.revertedWith(`Exchange: Wrong amount`);
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
            verifyingContract: exchangeInstance.address,
          },
          // Types
          {
            EIP712: [
              { name: "nonce", type: "bytes32" },
              { name: "account", type: "address" },
              { name: "items", type: "Asset[]" },
              { name: "ingredients", type: "Asset[]" },
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
            ingredients: [
              {
                tokenType: 1,
                token: erc20Instance.address,
                tokenId,
                amount,
              },
            ],
          },
        );

        await erc20Instance.mint(this.receiver.address, amount);
        await erc20Instance.connect(this.receiver).approve(exchangeInstance.address, amount);

        const tx1 = exchangeInstance.connect(this.receiver).execute(
          nonce,
          [
            {
              tokenType: 4,
              token: erc1155Instance.address,
              tokenId,
              amount,
            },
          ],
          [
            {
              tokenType: 1,
              token: erc20Instance.address,
              tokenId,
              amount,
            },
          ],
          this.owner.address,
          signature,
        );

        await expect(tx1)
          .to.emit(exchangeInstance, "Transaction")
          // .withArgs(
          //   this.receiver.address,
          //   [[2, erc1155Instance.address, tokenId, amount]],
          //   [[1, erc20Instance.address, tokenId, amount]],
          // )
          .to.emit(erc1155Instance, "TransferSingle")
          .withArgs(exchangeInstance.address, ethers.constants.AddressZero, this.receiver.address, tokenId, amount)
          .to.emit(erc20Instance, "Transfer")
          .withArgs(this.receiver.address, exchangeInstance.address, amount);
      });

      it("should fail: insufficient allowance", async function () {
        const signature = await this.owner._signTypedData(
          // Domain
          {
            name: tokenName,
            version: "1.0.0",
            chainId: network.chainId,
            verifyingContract: exchangeInstance.address,
          },
          // Types
          {
            EIP712: [
              { name: "nonce", type: "bytes32" },
              { name: "account", type: "address" },
              { name: "items", type: "Asset[]" },
              { name: "ingredients", type: "Asset[]" },
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
            ingredients: [
              {
                tokenType: 1,
                token: erc20Instance.address,
                tokenId,
                amount,
              },
            ],
          },
        );

        await erc20Instance.mint(this.receiver.address, amount);
        // await erc20Instance.connect(this.receiver).approve(exchangeInstance.address, amount);

        const tx1 = exchangeInstance.connect(this.receiver).execute(
          nonce,
          [
            {
              tokenType: 4,
              token: erc1155Instance.address,
              tokenId,
              amount,
            },
          ],
          [
            {
              tokenType: 1,
              token: erc20Instance.address,
              tokenId,
              amount,
            },
          ],
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
            verifyingContract: exchangeInstance.address,
          },
          // Types
          {
            EIP712: [
              { name: "nonce", type: "bytes32" },
              { name: "account", type: "address" },
              { name: "items", type: "Asset[]" },
              { name: "ingredients", type: "Asset[]" },
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
            ingredients: [
              {
                tokenType: 1,
                token: erc20Instance.address,
                tokenId,
                amount,
              },
            ],
          },
        );

        // await erc20Instance.mint(this.receiver.address, amount);
        await erc20Instance.connect(this.receiver).approve(exchangeInstance.address, amount);

        const tx1 = exchangeInstance.connect(this.receiver).execute(
          nonce,
          [
            {
              tokenType: 4,
              token: erc1155Instance.address,
              tokenId,
              amount,
            },
          ],
          [
            {
              tokenType: 1,
              token: erc20Instance.address,
              tokenId,
              amount,
            },
          ],
          this.owner.address,
          signature,
        );

        await expect(tx1).to.be.revertedWith(`ERC20: transfer amount exceeds balance`);
      });
    });

    describe("ERC1155 > ERC1155", function () {
      it("should execute", async function () {
        const signature = await this.owner._signTypedData(
          // Domain
          {
            name: tokenName,
            version: "1.0.0",
            chainId: network.chainId,
            verifyingContract: exchangeInstance.address,
          },
          // Types
          {
            EIP712: [
              { name: "nonce", type: "bytes32" },
              { name: "account", type: "address" },
              { name: "items", type: "Asset[]" },
              { name: "ingredients", type: "Asset[]" },
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
                tokenId: 2,
                amount: 1,
              },
            ],
            ingredients: [
              {
                tokenType: 4,
                token: erc1155Instance.address,
                tokenId,
                amount,
              },
            ],
          },
        );

        await erc1155Instance.mint(this.receiver.address, tokenId, amount, "0x");
        await erc1155Instance.connect(this.receiver).setApprovalForAll(exchangeInstance.address, true);

        const tx1 = exchangeInstance.connect(this.receiver).execute(
          nonce,
          [
            {
              tokenType: 4,
              token: erc1155Instance.address,
              tokenId: 2,
              amount: 1,
            },
          ],
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

        await expect(tx1).to.emit(exchangeInstance, "Transaction");
        // https://github.com/TrueFiEng/Waffle/pull/751
        // .withArgs(this.receiver.address, [[4, erc1155Instance.address, tokenId, amount]]);
      });

      it("should fail: caller is not token owner nor approved", async function () {
        const signature = await this.owner._signTypedData(
          // Domain
          {
            name: tokenName,
            version: "1.0.0",
            chainId: network.chainId,
            verifyingContract: exchangeInstance.address,
          },
          // Types
          {
            EIP712: [
              { name: "nonce", type: "bytes32" },
              { name: "account", type: "address" },
              { name: "items", type: "Asset[]" },
              { name: "ingredients", type: "Asset[]" },
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
                tokenId: 1,
                amount,
              },
            ],
            ingredients: [
              {
                tokenType: 4,
                token: erc1155Instance.address,
                tokenId: 2,
                amount,
              },
            ],
          },
        );

        await erc1155Instance.mint(this.receiver.address, 2, amount, "0x");
        // await erc1155Instance.connect(this.receiver).setApprovalForAll(exchangeInstance.address, true);

        const tx1 = exchangeInstance.connect(this.receiver).execute(
          nonce,
          [
            {
              tokenType: 4,
              token: erc1155Instance.address,
              tokenId: 1,
              amount,
            },
          ],
          [
            {
              tokenType: 4,
              token: erc1155Instance.address,
              tokenId: 2,
              amount,
            },
          ],
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
            verifyingContract: exchangeInstance.address,
          },
          // Types
          {
            EIP712: [
              { name: "nonce", type: "bytes32" },
              { name: "account", type: "address" },
              { name: "items", type: "Asset[]" },
              { name: "ingredients", type: "Asset[]" },
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
                tokenId: 1,
                amount,
              },
            ],
            ingredients: [
              {
                tokenType: 4,
                token: erc1155Instance.address,
                tokenId: 2,
                amount,
              },
            ],
          },
        );

        // await erc1155Instance.mint(this.receiver.address, 2, amount, "0x");
        await erc1155Instance.connect(this.receiver).setApprovalForAll(exchangeInstance.address, true);

        const tx1 = exchangeInstance.connect(this.receiver).execute(
          nonce,
          [
            {
              tokenType: 4,
              token: erc1155Instance.address,
              tokenId: 1,
              amount,
            },
          ],
          [
            {
              tokenType: 4,
              token: erc1155Instance.address,
              tokenId: 2,
              amount,
            },
          ],
          this.owner.address,
          signature,
        );

        await expect(tx1).to.be.revertedWith(`ERC1155: insufficient balance for transfer`);
      });
    });

    describe("NATIVE > LOOTBOX", function () {
      it("should execute", async function () {
        const signature = await this.owner._signTypedData(
          // Domain
          {
            name: tokenName,
            version: "1.0.0",
            chainId: network.chainId,
            verifyingContract: exchangeInstance.address,
          },
          // Types
          {
            EIP712: [
              { name: "nonce", type: "bytes32" },
              { name: "account", type: "address" },
              { name: "items", type: "Asset[]" },
              { name: "ingredients", type: "Asset[]" },
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
                tokenType: 2,
                token: lootboxInstance.address,
                tokenId,
                amount: 1,
              },
            ],
            ingredients: [
              {
                tokenType: 0,
                token: ethers.constants.AddressZero,
                tokenId,
                amount,
              },
            ],
          },
        );

        const tx1 = exchangeInstance.connect(this.receiver).execute(
          nonce,
          [
            {
              tokenType: 2,
              token: lootboxInstance.address,
              tokenId,
              amount: 1,
            },
          ],
          [
            {
              tokenType: 0,
              token: ethers.constants.AddressZero,
              tokenId,
              amount,
            },
          ],
          this.owner.address,
          signature,
          {
            value: amount,
          },
        );

        await expect(tx1)
          .to.changeEtherBalance(this.receiver, -amount)
          .to.emit(exchangeInstance, "Transaction")
          // .withArgs(
          //   this.receiver.address,
          //   [[2, erc721Instance.address, tokenId, 1]],
          //   [[0, ethers.constants.AddressZero, tokenId, amount]],
          // )
          .to.emit(lootboxInstance, "Transfer")
          .withArgs(ethers.constants.AddressZero, this.receiver.address, tokenId);
      });
    });

    describe("ERROR", function () {
      it("should fail: duplicate mint", async function () {
        const signature = await this.owner._signTypedData(
          // Domain
          {
            name: tokenName,
            version: "1.0.0",
            chainId: network.chainId,
            verifyingContract: exchangeInstance.address,
          },
          // Types
          {
            EIP712: [
              { name: "nonce", type: "bytes32" },
              { name: "account", type: "address" },
              { name: "items", type: "Asset[]" },
              { name: "ingredients", type: "Asset[]" },
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
            items: [],
            ingredients: [],
          },
        );

        const tx1 = exchangeInstance.connect(this.receiver).execute(nonce, [], [], this.owner.address, signature);

        await expect(tx1).to.emit(exchangeInstance, "Transaction");

        const tx2 = exchangeInstance.connect(this.receiver).execute(nonce, [], [], this.owner.address, signature);
        await expect(tx2).to.be.revertedWith("Exchange: Expired signature");
      });

      it("should fail for wrong signer role", async function () {
        const signature = await this.owner._signTypedData(
          // Domain
          {
            name: tokenName,
            version: "1.0.0",
            chainId: network.chainId,
            verifyingContract: exchangeInstance.address,
          },
          // Types
          {
            EIP712: [
              { name: "nonce", type: "bytes32" },
              { name: "account", type: "address" },
              { name: "items", type: "Asset[]" },
              { name: "ingredients", type: "Asset[]" },
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
            items: [],
            ingredients: [],
          },
        );

        const tx1 = exchangeInstance.connect(this.receiver).execute(nonce, [], [], this.receiver.address, signature);

        await expect(tx1).to.be.revertedWith(`Exchange: Wrong signer`);
      });

      it("should fail for wrong signature", async function () {
        const tx = exchangeInstance.execute(
          nonce,
          [],
          [],
          this.owner.address,
          ethers.utils.formatBytes32String("signature"),
        );

        await expect(tx).to.be.revertedWith(`Exchange: Invalid signature`);
      });
    });
  });
});
