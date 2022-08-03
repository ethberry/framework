import { expect } from "chai";
import { ethers } from "hardhat";
import { Network } from "@ethersproject/networks";

import { ERC1155Simple, ERC20Simple, ERC721Mysterybox, ERC721Simple, Exchange } from "../../../typechain-types";
import {
  amount,
  baseTokenURI,
  DEFAULT_ADMIN_ROLE,
  MINTER_ROLE,
  params,
  PAUSER_ROLE,
  royalty,
  tokenId,
  tokenName,
  tokenSymbol,
} from "../../constants";
import { shouldHaveRole } from "../../shared/accessControl/hasRoles";
import { wrapManyToManySignature } from "./shared/utils";

describe("ExchangeCore", function () {
  let exchangeInstance: Exchange;
  let erc20Instance: ERC20Simple;
  let erc721Instance: ERC721Simple;
  let erc1155Instance: ERC1155Simple;
  let mysteryboxInstance: ERC721Mysterybox;
  let network: Network;

  let generateSignature: (values: Record<string, any>) => Promise<string>;

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
    erc1155Instance = await erc1155Factory.deploy(royalty, baseTokenURI);
    await erc1155Instance.grantRole(MINTER_ROLE, exchangeInstance.address);

    const mysteryboxFactory = await ethers.getContractFactory("ERC721Mysterybox");
    mysteryboxInstance = await mysteryboxFactory.deploy(tokenName, tokenSymbol, royalty, baseTokenURI);
    await mysteryboxInstance.grantRole(MINTER_ROLE, exchangeInstance.address);

    network = await ethers.provider.getNetwork();

    generateSignature = wrapManyToManySignature(network, exchangeInstance, this.owner);

    this.contractInstance = exchangeInstance;
  });

  shouldHaveRole(DEFAULT_ADMIN_ROLE, PAUSER_ROLE);

  describe("craft", function () {
    describe("NULL > NULL", function () {
      it("NULL > NULL", async function () {
        const signature = await generateSignature({
          account: this.receiver.address,
          params,
          items: [],
          price: [],
        });

        const tx1 = exchangeInstance.connect(this.receiver).craft(params, [], [], this.owner.address, signature);

        await expect(tx1).to.emit(exchangeInstance, "Craft");
        // https://github.com/TrueFiEng/Waffle/pull/751
        // .withArgs(this.receiver.address, [[4, erc1155Instance.address, tokenId, amount]]);
      });
    });

    describe("NULL > ERC721", function () {
      it("should purchase", async function () {
        const signature = await generateSignature({
          account: this.receiver.address,
          params,
          items: [
            {
              tokenType: 2,
              token: erc721Instance.address,
              tokenId,
              amount,
            },
          ],
          price: [],
        });

        const tx1 = exchangeInstance.connect(this.receiver).craft(
          params,
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

        await expect(tx1).to.emit(exchangeInstance, "Craft");
        // https://github.com/TrueFiEng/Waffle/pull/751
        // .withArgs(this.receiver.address, [[4, erc1155Instance.address, tokenId, amount]]);
      });
    });

    describe("NULL > ERC1155", function () {
      it("should purchase", async function () {
        const signature = await generateSignature({
          account: this.receiver.address,
          params,
          items: [
            {
              tokenType: 4,
              token: erc1155Instance.address,
              tokenId,
              amount,
            },
          ],
          price: [],
        });

        const tx1 = exchangeInstance.connect(this.receiver).craft(
          params,
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

        await expect(tx1).to.emit(exchangeInstance, "Craft");
        // https://github.com/TrueFiEng/Waffle/pull/751
        // .withArgs(this.receiver.address, [[4, erc1155Instance.address, tokenId, amount]]);
      });
    });

    describe("NATIVE > ERC721", function () {
      it("should purchase", async function () {
        const signature = await generateSignature({
          account: this.receiver.address,
          params,
          items: [
            {
              tokenType: 2,
              token: erc721Instance.address,
              tokenId,
              amount: 1,
            },
          ],
          price: [
            {
              tokenType: 0,
              token: ethers.constants.AddressZero,
              tokenId,
              amount,
            },
          ],
        });

        const tx1 = exchangeInstance.connect(this.receiver).craft(
          params,
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
          // .to.changeEtherBalance(this.receiver, -amount)
          .to.emit(exchangeInstance, "Craft")
          // .withArgs(
          //   this.receiver.address,
          //   [[2, erc721Instance.address, tokenId, 1]],
          //   [[0, ethers.constants.AddressZero, tokenId, amount]],
          // )
          .to.emit(erc721Instance, "Transfer")
          .withArgs(ethers.constants.AddressZero, this.receiver.address, tokenId);
      });

      it("should fail: Wrong amount", async function () {
        const signature = await generateSignature({
          account: this.receiver.address,
          params,
          items: [
            {
              tokenType: 2,
              token: erc721Instance.address,
              tokenId,
              amount: 1,
            },
          ],
          price: [
            {
              tokenType: 0,
              token: ethers.constants.AddressZero,
              tokenId,
              amount,
            },
          ],
        });

        const tx1 = exchangeInstance.connect(this.receiver).craft(
          params,
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
      it("should craft", async function () {
        const signature = await generateSignature({
          account: this.receiver.address,
          params,
          items: [
            {
              tokenType: 2,
              token: erc721Instance.address,
              tokenId,
              amount: 1,
            },
          ],
          price: [
            {
              tokenType: 1,
              token: erc20Instance.address,
              tokenId,
              amount,
            },
          ],
        });

        await erc20Instance.mint(this.receiver.address, amount);
        await erc20Instance.connect(this.receiver).approve(exchangeInstance.address, amount);

        const tx1 = exchangeInstance.connect(this.receiver).craft(
          params,
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
          .to.emit(exchangeInstance, "Craft")
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
        const signature = await generateSignature({
          account: this.receiver.address,
          params,
          items: [
            {
              tokenType: 2,
              token: erc721Instance.address,
              tokenId,
              amount: 1,
            },
          ],
          price: [
            {
              tokenType: 1,
              token: erc20Instance.address,
              tokenId,
              amount,
            },
          ],
        });

        await erc20Instance.mint(this.receiver.address, amount);
        // await erc20Instance.connect(this.receiver).approve(exchangeInstance.address, amount);

        const tx1 = exchangeInstance.connect(this.receiver).craft(
          params,
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
        const signature = await generateSignature({
          account: this.receiver.address,
          params,
          items: [
            {
              tokenType: 2,
              token: erc721Instance.address,
              tokenId,
              amount: 1,
            },
          ],
          price: [
            {
              tokenType: 1,
              token: erc20Instance.address,
              tokenId,
              amount,
            },
          ],
        });

        // await erc20Instance.mint(this.receiver.address, amount);
        await erc20Instance.connect(this.receiver).approve(exchangeInstance.address, amount);

        const tx1 = exchangeInstance.connect(this.receiver).craft(
          params,
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
      it("should craft", async function () {
        const signature = await generateSignature({
          account: this.receiver.address,
          params,
          items: [
            {
              tokenType: 2,
              token: erc721Instance.address,
              tokenId,
              amount,
            },
          ],
          price: [
            {
              tokenType: 4,
              token: erc1155Instance.address,
              tokenId,
              amount,
            },
          ],
        });

        await erc1155Instance.mint(this.receiver.address, tokenId, amount, "0x");
        await erc1155Instance.connect(this.receiver).setApprovalForAll(exchangeInstance.address, true);

        const tx1 = exchangeInstance.connect(this.receiver).craft(
          params,
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

        await expect(tx1).to.emit(exchangeInstance, "Craft");
        // https://github.com/TrueFiEng/Waffle/pull/751
        // .withArgs(this.receiver.address, [[4, erc1155Instance.address, tokenId, amount]]);
      });

      it("should fail: caller is not token owner nor approved", async function () {
        const signature = await generateSignature({
          account: this.receiver.address,
          params,
          items: [
            {
              tokenType: 2,
              token: erc721Instance.address,
              tokenId,
              amount: 1,
            },
          ],
          price: [
            {
              tokenType: 4,
              token: erc1155Instance.address,
              tokenId,
              amount,
            },
          ],
        });

        await erc1155Instance.mint(this.receiver.address, tokenId, amount, "0x");
        // await erc1155Instance.connect(this.receiver).setApprovalForAll(exchangeInstance.address, true);

        const tx1 = exchangeInstance.connect(this.receiver).craft(
          params,
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
        const signature = await generateSignature({
          account: this.receiver.address,
          params,
          items: [
            {
              tokenType: 2,
              token: erc721Instance.address,
              tokenId,
              amount: 1,
            },
          ],
          price: [
            {
              tokenType: 4,
              token: erc1155Instance.address,
              tokenId,
              amount,
            },
          ],
        });

        // await erc1155Instance.mint(this.receiver.address, tokenId, amount, "0x");
        await erc1155Instance.connect(this.receiver).setApprovalForAll(exchangeInstance.address, true);

        const tx1 = exchangeInstance.connect(this.receiver).craft(
          params,
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
      it("should craft", async function () {
        const signature = await generateSignature({
          account: this.receiver.address,
          params,
          items: [
            {
              tokenType: 4,
              token: erc1155Instance.address,
              tokenId,
              amount,
            },
          ],
          price: [
            {
              tokenType: 0,
              token: ethers.constants.AddressZero,
              tokenId,
              amount,
            },
          ],
        });

        const tx1 = exchangeInstance.connect(this.receiver).craft(
          params,
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
          // .to.changeEtherBalance(this.receiver, -amount)
          .to.emit(exchangeInstance, "Craft")
          // .withArgs(
          //   this.receiver.address,
          //   [[4, erc1155Instance.address, tokenId, amount]],
          //   [[0, ethers.constants.AddressZero, tokenId, amount]],
          // )
          .to.emit(erc1155Instance, "TransferSingle")
          .withArgs(exchangeInstance.address, ethers.constants.AddressZero, this.receiver.address, tokenId, amount);
      });

      it("should fail: Wrong amount", async function () {
        const signature = await generateSignature({
          account: this.receiver.address,
          params,
          items: [
            {
              tokenType: 4,
              token: erc1155Instance.address,
              tokenId,
              amount,
            },
          ],
          price: [
            {
              tokenType: 0,
              token: ethers.constants.AddressZero,
              tokenId,
              amount,
            },
          ],
        });

        const tx1 = exchangeInstance.connect(this.receiver).craft(
          params,
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
      it("should craft", async function () {
        const signature = await generateSignature({
          account: this.receiver.address,
          params,
          items: [
            {
              tokenType: 4,
              token: erc1155Instance.address,
              tokenId,
              amount,
            },
          ],
          price: [
            {
              tokenType: 1,
              token: erc20Instance.address,
              tokenId,
              amount,
            },
          ],
        });

        await erc20Instance.mint(this.receiver.address, amount);
        await erc20Instance.connect(this.receiver).approve(exchangeInstance.address, amount);

        const tx1 = exchangeInstance.connect(this.receiver).craft(
          params,
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
          .to.emit(exchangeInstance, "Craft")
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
        const signature = await generateSignature({
          account: this.receiver.address,
          params,
          items: [
            {
              tokenType: 4,
              token: erc1155Instance.address,
              tokenId,
              amount,
            },
          ],
          price: [
            {
              tokenType: 1,
              token: erc20Instance.address,
              tokenId,
              amount,
            },
          ],
        });

        await erc20Instance.mint(this.receiver.address, amount);
        // await erc20Instance.connect(this.receiver).approve(exchangeInstance.address, amount);

        const tx1 = exchangeInstance.connect(this.receiver).craft(
          params,
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
        const signature = await generateSignature({
          account: this.receiver.address,
          params,
          items: [
            {
              tokenType: 4,
              token: erc1155Instance.address,
              tokenId,
              amount,
            },
          ],
          price: [
            {
              tokenType: 1,
              token: erc20Instance.address,
              tokenId,
              amount,
            },
          ],
        });

        // await erc20Instance.mint(this.receiver.address, amount);
        await erc20Instance.connect(this.receiver).approve(exchangeInstance.address, amount);

        const tx1 = exchangeInstance.connect(this.receiver).craft(
          params,
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
      it("should craft", async function () {
        const signature = await generateSignature({
          account: this.receiver.address,
          params,
          items: [
            {
              tokenType: 4,
              token: erc1155Instance.address,
              tokenId: 2,
              amount: 1,
            },
          ],
          price: [
            {
              tokenType: 4,
              token: erc1155Instance.address,
              tokenId,
              amount,
            },
          ],
        });

        await erc1155Instance.mint(this.receiver.address, tokenId, amount, "0x");
        await erc1155Instance.connect(this.receiver).setApprovalForAll(exchangeInstance.address, true);

        const tx1 = exchangeInstance.connect(this.receiver).craft(
          params,
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

        await expect(tx1).to.emit(exchangeInstance, "Craft");
        // https://github.com/TrueFiEng/Waffle/pull/751
        // .withArgs(this.receiver.address, [[4, erc1155Instance.address, tokenId, amount]]);
      });

      it("should fail: caller is not token owner nor approved", async function () {
        const signature = await generateSignature({
          account: this.receiver.address,
          params,
          items: [
            {
              tokenType: 4,
              token: erc1155Instance.address,
              tokenId: 1,
              amount,
            },
          ],
          price: [
            {
              tokenType: 4,
              token: erc1155Instance.address,
              tokenId: 2,
              amount,
            },
          ],
        });

        await erc1155Instance.mint(this.receiver.address, 2, amount, "0x");
        // await erc1155Instance.connect(this.receiver).setApprovalForAll(exchangeInstance.address, true);

        const tx1 = exchangeInstance.connect(this.receiver).craft(
          params,
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
        const signature = await generateSignature({
          account: this.receiver.address,
          params,
          items: [
            {
              tokenType: 4,
              token: erc1155Instance.address,
              tokenId: 1,
              amount,
            },
          ],
          price: [
            {
              tokenType: 4,
              token: erc1155Instance.address,
              tokenId: 2,
              amount,
            },
          ],
        });

        // await erc1155Instance.mint(this.receiver.address, 2, amount, "0x");
        await erc1155Instance.connect(this.receiver).setApprovalForAll(exchangeInstance.address, true);

        const tx1 = exchangeInstance.connect(this.receiver).craft(
          params,
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
  });

  describe("ERROR", function () {
    it("should fail: duplicate mint", async function () {
      const signature = await generateSignature({
        account: this.receiver.address,
        params,
        items: [],
        price: [],
      });

      const tx1 = exchangeInstance.connect(this.receiver).craft(params, [], [], this.owner.address, signature);

      await expect(tx1).to.emit(exchangeInstance, "Craft");

      const tx2 = exchangeInstance.connect(this.receiver).craft(params, [], [], this.owner.address, signature);
      await expect(tx2).to.be.revertedWith("Exchange: Expired signature");
    });

    it("should fail for wrong signer role", async function () {
      const signature = await generateSignature({
        account: this.receiver.address,
        params,
        items: [],
        price: [],
      });

      const tx1 = exchangeInstance.connect(this.receiver).craft(params, [], [], this.receiver.address, signature);

      await expect(tx1).to.be.revertedWith(`Exchange: Wrong signer`);
    });

    it("should fail for wrong signature", async function () {
      const tx = exchangeInstance.craft(
        params,
        [],
        [],
        this.owner.address,
        ethers.utils.formatBytes32String("signature"),
      );

      await expect(tx).to.be.revertedWith(`Exchange: Invalid signature`);
    });
  });
});
