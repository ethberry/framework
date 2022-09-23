import { expect } from "chai";
import { ethers } from "hardhat";
import { constants, utils } from "ethers";
import { amount, params, tokenId } from "../../constants";
import { deployErc1155Fixture, deployErc20Fixture, deployErc721Fixture, deployExchangeFixture } from "./shared/fixture";

describe("ExchangeCore", function () {
  // shouldHaveRole(DEFAULT_ADMIN_ROLE, PAUSER_ROLE);

  describe("craft", function () {
    describe("NULL > NULL", function () {
      it("NULL > NULL", async function () {
        const [owner, receiver] = await ethers.getSigners();
        const { exchangeInstance, generateManyToManySignature } = await deployExchangeFixture();

        const signature = await generateManyToManySignature({
          account: receiver.address,
          params,
          items: [],
          price: [],
        });

        const tx1 = exchangeInstance.connect(receiver).craft(params, [], [], owner.address, signature);

        await expect(tx1).to.emit(exchangeInstance, "Craft");
        // https://github.com/TrueFiEng/Waffle/pull/751
        // .withArgs(receiver.address, [[4, erc1155Instance.address, tokenId, amount]]);
      });
    });

    describe("NULL > ERC721", function () {
      it("should purchase", async function () {
        const [owner, receiver] = await ethers.getSigners();
        const { exchangeInstance, generateManyToManySignature } = await deployExchangeFixture();
        const { erc721Instance } = await deployErc721Fixture("ERC721Simple", exchangeInstance);

        const signature = await generateManyToManySignature({
          account: receiver.address,
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

        const tx1 = exchangeInstance.connect(receiver).craft(
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
          owner.address,
          signature,
        );

        await expect(tx1).to.emit(exchangeInstance, "Craft");
        // https://github.com/TrueFiEng/Waffle/pull/751
        // .withArgs(receiver.address, [[4, erc1155Instance.address, tokenId, amount]]);
      });
    });

    describe("NULL > ERC1155", function () {
      it("should purchase", async function () {
        const [owner, receiver] = await ethers.getSigners();
        const { exchangeInstance, generateManyToManySignature } = await deployExchangeFixture();
        const { erc1155Instance } = await deployErc1155Fixture("ERC1155Simple", exchangeInstance);

        const signature = await generateManyToManySignature({
          account: receiver.address,
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

        const tx1 = exchangeInstance.connect(receiver).craft(
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
          owner.address,
          signature,
        );

        await expect(tx1).to.emit(exchangeInstance, "Craft");
        // https://github.com/TrueFiEng/Waffle/pull/751
        // .withArgs(receiver.address, [[4, erc1155Instance.address, tokenId, amount]]);
      });
    });

    describe("NATIVE > ERC721", function () {
      it("should purchase", async function () {
        const [owner, receiver] = await ethers.getSigners();
        const { exchangeInstance, generateManyToManySignature } = await deployExchangeFixture();
        const { erc721Instance } = await deployErc721Fixture("ERC721Simple", exchangeInstance);

        const signature = await generateManyToManySignature({
          account: receiver.address,
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
              token: constants.AddressZero,
              tokenId,
              amount,
            },
          ],
        });

        const tx1 = exchangeInstance.connect(receiver).craft(
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
              token: constants.AddressZero,
              tokenId,
              amount,
            },
          ],
          owner.address,
          signature,
          {
            value: amount,
          },
        );

        await expect(tx1)
          // .to.changeEtherBalance(receiver, -amount)
          .to.emit(exchangeInstance, "Craft")
          // .withArgs(
          //   receiver.address,
          //   [[2, erc721Instance.address, tokenId, 1]],
          //   [[0, constants.AddressZero, tokenId, amount]],
          // )
          .to.emit(erc721Instance, "Transfer")
          .withArgs(constants.AddressZero, receiver.address, tokenId);
      });

      it("should fail: Wrong amount", async function () {
        const [owner, receiver] = await ethers.getSigners();
        const { exchangeInstance, generateManyToManySignature } = await deployExchangeFixture();
        const { erc721Instance } = await deployErc721Fixture("ERC721Simple", exchangeInstance);

        const signature = await generateManyToManySignature({
          account: receiver.address,
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
              token: constants.AddressZero,
              tokenId,
              amount,
            },
          ],
        });

        const tx1 = exchangeInstance.connect(receiver).craft(
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
              token: constants.AddressZero,
              tokenId,
              amount,
            },
          ],
          owner.address,
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
        const [owner, receiver] = await ethers.getSigners();
        const { exchangeInstance, generateManyToManySignature } = await deployExchangeFixture();
        const { erc20Instance } = await deployErc20Fixture("ERC20Simple", exchangeInstance);
        const { erc721Instance } = await deployErc721Fixture("ERC721Simple", exchangeInstance);

        const signature = await generateManyToManySignature({
          account: receiver.address,
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

        await erc20Instance.mint(receiver.address, amount);
        await erc20Instance.connect(receiver).approve(exchangeInstance.address, amount);

        const tx1 = exchangeInstance.connect(receiver).craft(
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
          owner.address,
          signature,
        );

        await expect(tx1)
          .to.emit(exchangeInstance, "Craft")
          // .withArgs(
          //   receiver.address,
          //   [[2, erc721Instance.address, tokenId, 1]],
          //   [[1, erc20Instance.address, tokenId, amount]],
          // )
          .to.emit(erc721Instance, "Transfer")
          .withArgs(constants.AddressZero, receiver.address, tokenId)
          .to.emit(erc20Instance, "Transfer")
          .withArgs(receiver.address, exchangeInstance.address, amount);
      });

      it("should fail: insufficient allowance", async function () {
        const [owner, receiver] = await ethers.getSigners();
        const { exchangeInstance, generateManyToManySignature } = await deployExchangeFixture();
        const { erc20Instance } = await deployErc20Fixture("ERC20Simple", exchangeInstance);
        const { erc721Instance } = await deployErc721Fixture("ERC721Simple", exchangeInstance);

        const signature = await generateManyToManySignature({
          account: receiver.address,
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

        await erc20Instance.mint(receiver.address, amount);
        // await erc20Instance.connect(receiver).approve(exchangeInstance.address, amount);

        const tx1 = exchangeInstance.connect(receiver).craft(
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
          owner.address,
          signature,
        );

        await expect(tx1).to.be.revertedWith(`ERC20: insufficient allowance`);
      });

      it("should fail: transfer amount exceeds balance", async function () {
        const [owner, receiver] = await ethers.getSigners();
        const { exchangeInstance, generateManyToManySignature } = await deployExchangeFixture();
        const { erc20Instance } = await deployErc20Fixture("ERC20Simple", exchangeInstance);
        const { erc721Instance } = await deployErc721Fixture("ERC721Simple", exchangeInstance);

        const signature = await generateManyToManySignature({
          account: receiver.address,
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

        // await erc20Instance.mint(receiver.address, amount);
        await erc20Instance.connect(receiver).approve(exchangeInstance.address, amount);

        const tx1 = exchangeInstance.connect(receiver).craft(
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
          owner.address,
          signature,
        );

        await expect(tx1).to.be.revertedWith(`ERC20: transfer amount exceeds balance`);
      });
    });

    describe("ERC1155 > ERC721", function () {
      it("should craft", async function () {
        const [owner, receiver] = await ethers.getSigners();
        const { exchangeInstance, generateManyToManySignature } = await deployExchangeFixture();
        const { erc721Instance } = await deployErc721Fixture("ERC721Simple", exchangeInstance);
        const { erc1155Instance } = await deployErc1155Fixture("ERC1155Simple", exchangeInstance);

        const signature = await generateManyToManySignature({
          account: receiver.address,
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

        await erc1155Instance.mint(receiver.address, tokenId, amount, "0x");
        await erc1155Instance.connect(receiver).setApprovalForAll(exchangeInstance.address, true);

        const tx1 = exchangeInstance.connect(receiver).craft(
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
          owner.address,
          signature,
        );

        await expect(tx1).to.emit(exchangeInstance, "Craft");
        // https://github.com/TrueFiEng/Waffle/pull/751
        // .withArgs(receiver.address, [[4, erc1155Instance.address, tokenId, amount]]);
      });

      it("should fail: caller is not token owner nor approved", async function () {
        const [owner, receiver] = await ethers.getSigners();
        const { exchangeInstance, generateManyToManySignature } = await deployExchangeFixture();
        const { erc721Instance } = await deployErc721Fixture("ERC721Simple", exchangeInstance);
        const { erc1155Instance } = await deployErc1155Fixture("ERC1155Simple", exchangeInstance);

        const signature = await generateManyToManySignature({
          account: receiver.address,
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

        await erc1155Instance.mint(receiver.address, tokenId, amount, "0x");
        // await erc1155Instance.connect(receiver).setApprovalForAll(exchangeInstance.address, true);

        const tx1 = exchangeInstance.connect(receiver).craft(
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
          owner.address,
          signature,
        );

        await expect(tx1).to.be.revertedWith(`ERC1155: caller is not token owner nor approved`);
      });

      it("should fail: insufficient balance for transfer", async function () {
        const [owner, receiver] = await ethers.getSigners();
        const { exchangeInstance, generateManyToManySignature } = await deployExchangeFixture();
        const { erc721Instance } = await deployErc721Fixture("ERC721Simple", exchangeInstance);
        const { erc1155Instance } = await deployErc1155Fixture("ERC1155Simple", exchangeInstance);

        const signature = await generateManyToManySignature({
          account: receiver.address,
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

        // await erc1155Instance.mint(receiver.address, tokenId, amount, "0x");
        await erc1155Instance.connect(receiver).setApprovalForAll(exchangeInstance.address, true);

        const tx1 = exchangeInstance.connect(receiver).craft(
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
          owner.address,
          signature,
        );

        await expect(tx1).to.be.revertedWith(`ERC1155: insufficient balance for transfer`);
      });
    });

    describe("NATIVE > ERC1155", function () {
      it("should craft", async function () {
        const [owner, receiver] = await ethers.getSigners();
        const { exchangeInstance, generateManyToManySignature } = await deployExchangeFixture();
        const { erc1155Instance } = await deployErc1155Fixture("ERC1155Simple", exchangeInstance);

        const signature = await generateManyToManySignature({
          account: receiver.address,
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
              token: constants.AddressZero,
              tokenId,
              amount,
            },
          ],
        });

        const tx1 = exchangeInstance.connect(receiver).craft(
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
              token: constants.AddressZero,
              tokenId,
              amount,
            },
          ],
          owner.address,
          signature,
          {
            value: amount,
          },
        );

        await expect(tx1)
          // .to.changeEtherBalance(receiver, -amount)
          .to.emit(exchangeInstance, "Craft")
          // .withArgs(
          //   receiver.address,
          //   [[4, erc1155Instance.address, tokenId, amount]],
          //   [[0, constants.AddressZero, tokenId, amount]],
          // )
          .to.emit(erc1155Instance, "TransferSingle")
          .withArgs(exchangeInstance.address, constants.AddressZero, receiver.address, tokenId, amount);
      });

      it("should fail: Wrong amount", async function () {
        const [owner, receiver] = await ethers.getSigners();
        const { exchangeInstance, generateManyToManySignature } = await deployExchangeFixture();
        const { erc1155Instance } = await deployErc1155Fixture("ERC1155Simple", exchangeInstance);

        const signature = await generateManyToManySignature({
          account: receiver.address,
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
              token: constants.AddressZero,
              tokenId,
              amount,
            },
          ],
        });

        const tx1 = exchangeInstance.connect(receiver).craft(
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
              token: constants.AddressZero,
              tokenId,
              amount,
            },
          ],
          owner.address,
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
        const [owner, receiver] = await ethers.getSigners();
        const { exchangeInstance, generateManyToManySignature } = await deployExchangeFixture();
        const { erc20Instance } = await deployErc20Fixture("ERC20Simple", exchangeInstance);
        const { erc1155Instance } = await deployErc1155Fixture("ERC1155Simple", exchangeInstance);

        const signature = await generateManyToManySignature({
          account: receiver.address,
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

        await erc20Instance.mint(receiver.address, amount);
        await erc20Instance.connect(receiver).approve(exchangeInstance.address, amount);

        const tx1 = exchangeInstance.connect(receiver).craft(
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
          owner.address,
          signature,
        );

        await expect(tx1)
          .to.emit(exchangeInstance, "Craft")
          // .withArgs(
          //   receiver.address,
          //   [[2, erc1155Instance.address, tokenId, amount]],
          //   [[1, erc20Instance.address, tokenId, amount]],
          // )
          .to.emit(erc1155Instance, "TransferSingle")
          .withArgs(exchangeInstance.address, constants.AddressZero, receiver.address, tokenId, amount)
          .to.emit(erc20Instance, "Transfer")
          .withArgs(receiver.address, exchangeInstance.address, amount);
      });

      it("should fail: insufficient allowance", async function () {
        const [owner, receiver] = await ethers.getSigners();
        const { exchangeInstance, generateManyToManySignature } = await deployExchangeFixture();
        const { erc20Instance } = await deployErc20Fixture("ERC20Simple", exchangeInstance);
        const { erc1155Instance } = await deployErc1155Fixture("ERC1155Simple", exchangeInstance);

        const signature = await generateManyToManySignature({
          account: receiver.address,
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

        await erc20Instance.mint(receiver.address, amount);
        // await erc20Instance.connect(receiver).approve(exchangeInstance.address, amount);

        const tx1 = exchangeInstance.connect(receiver).craft(
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
          owner.address,
          signature,
        );

        await expect(tx1).to.be.revertedWith(`ERC20: insufficient allowance`);
      });

      it("should fail: transfer amount exceeds balance", async function () {
        const [owner, receiver] = await ethers.getSigners();
        const { exchangeInstance, generateManyToManySignature } = await deployExchangeFixture();
        const { erc20Instance } = await deployErc20Fixture("ERC20Simple", exchangeInstance);
        const { erc1155Instance } = await deployErc1155Fixture("ERC1155Simple", exchangeInstance);

        const signature = await generateManyToManySignature({
          account: receiver.address,
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

        // await erc20Instance.mint(receiver.address, amount);
        await erc20Instance.connect(receiver).approve(exchangeInstance.address, amount);

        const tx1 = exchangeInstance.connect(receiver).craft(
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
          owner.address,
          signature,
        );

        await expect(tx1).to.be.revertedWith(`ERC20: transfer amount exceeds balance`);
      });
    });

    describe("ERC1155 > ERC1155", function () {
      it("should craft", async function () {
        const [owner, receiver] = await ethers.getSigners();
        const { exchangeInstance, generateManyToManySignature } = await deployExchangeFixture();
        const { erc1155Instance } = await deployErc1155Fixture("ERC1155Simple", exchangeInstance);

        const signature = await generateManyToManySignature({
          account: receiver.address,
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

        await erc1155Instance.mint(receiver.address, tokenId, amount, "0x");
        await erc1155Instance.connect(receiver).setApprovalForAll(exchangeInstance.address, true);

        const tx1 = exchangeInstance.connect(receiver).craft(
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
          owner.address,
          signature,
        );

        await expect(tx1).to.emit(exchangeInstance, "Craft");
        // https://github.com/TrueFiEng/Waffle/pull/751
        // .withArgs(receiver.address, [[4, erc1155Instance.address, tokenId, amount]]);
      });

      it("should fail: caller is not token owner nor approved", async function () {
        const [owner, receiver] = await ethers.getSigners();
        const { exchangeInstance, generateManyToManySignature } = await deployExchangeFixture();
        const { erc1155Instance } = await deployErc1155Fixture("ERC1155Simple", exchangeInstance);

        const signature = await generateManyToManySignature({
          account: receiver.address,
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

        await erc1155Instance.mint(receiver.address, 2, amount, "0x");
        // await erc1155Instance.connect(receiver).setApprovalForAll(exchangeInstance.address, true);

        const tx1 = exchangeInstance.connect(receiver).craft(
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
          owner.address,
          signature,
        );

        await expect(tx1).to.be.revertedWith(`ERC1155: caller is not token owner nor approved`);
      });

      it("should fail: insufficient balance for transfer", async function () {
        const [owner, receiver] = await ethers.getSigners();
        const { exchangeInstance, generateManyToManySignature } = await deployExchangeFixture();
        const { erc1155Instance } = await deployErc1155Fixture("ERC1155Simple", exchangeInstance);

        const signature = await generateManyToManySignature({
          account: receiver.address,
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

        // await erc1155Instance.mint(receiver.address, 2, amount, "0x");
        await erc1155Instance.connect(receiver).setApprovalForAll(exchangeInstance.address, true);

        const tx1 = exchangeInstance.connect(receiver).craft(
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
          owner.address,
          signature,
        );

        await expect(tx1).to.be.revertedWith(`ERC1155: insufficient balance for transfer`);
      });
    });
  });

  describe("ERROR", function () {
    it("should fail: duplicate mint", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const { exchangeInstance, generateManyToManySignature } = await deployExchangeFixture();

      const signature = await generateManyToManySignature({
        account: receiver.address,
        params,
        items: [],
        price: [],
      });

      const tx1 = exchangeInstance.connect(receiver).craft(params, [], [], owner.address, signature);

      await expect(tx1).to.emit(exchangeInstance, "Craft");

      const tx2 = exchangeInstance.connect(receiver).craft(params, [], [], owner.address, signature);
      await expect(tx2).to.be.revertedWith("Exchange: Expired signature");
    });

    it("should fail for wrong signer role", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const { exchangeInstance, generateManyToManySignature } = await deployExchangeFixture();

      const signature = await generateManyToManySignature({
        account: receiver.address,
        params,
        items: [],
        price: [],
      });

      const tx1 = exchangeInstance.connect(receiver).craft(params, [], [], receiver.address, signature);

      await expect(tx1).to.be.revertedWith(`Exchange: Wrong signer`);
    });

    it("should fail for wrong signature", async function () {
      const [owner] = await ethers.getSigners();
      const { exchangeInstance } = await deployExchangeFixture();

      const tx = exchangeInstance.craft(params, [], [], owner.address, utils.formatBytes32String("signature"));

      await expect(tx).to.be.revertedWith(`Exchange: Invalid signature`);
    });
  });
});
