import { expect } from "chai";
import { ethers } from "hardhat";
import { ZeroAddress } from "ethers";

import { amount } from "@gemunion/contracts-constants";
import { deployContract, deployJerk, deployWallet } from "@gemunion/contracts-mocks";
import { shouldSupportsInterface } from "@gemunion/contracts-mocha";

import { templateId, tokenId } from "../../constants";
import { deployERC20 } from "../../ERC20/shared/fixtures";
import { deployERC721 } from "../../ERC721/shared/fixtures";
import { deployERC1155 } from "../../ERC1155/shared/fixtures";
import { checkIfInLogs } from "./shared/utils";

describe("Disperse", function () {
  const factory = () => deployContract("Disperse");
  describe("NATIVE", function () {
    it("should fail: deposit ether", async function () {
      const [owner] = await ethers.getSigners();

      const contractInstance = await factory();
      const tx = owner.sendTransaction({ to: await contractInstance.getAddress(), value: amount });
      await expect(tx).to.be.revertedWithoutReason();
    });

    it("should fail: not enough ether", async function () {
      const [_, receiver] = await ethers.getSigners();

      const contractInstance = await factory();

      const tx = contractInstance.disperseEther([receiver.address], [amount], { value: amount / 2n });
      await expect(tx).to.be.revertedWithCustomError(contractInstance, "NotEnoughBalance");
    });

    it("should fail: invalid Input", async function () {
      const [_, receiver] = await ethers.getSigners();

      const contractInstance = await factory();

      const tx = contractInstance.disperseEther([receiver.address], [], { value: amount });
      await expect(tx).to.be.revertedWith("Disperse: Invalid input");
    });

    // this test fails in coverage mode
    it.skip("should have reentrancy guard", async function () {
      const [_owner] = await ethers.getSigners();
      const contractInstance = await factory();
      const attackerFactory = await ethers.getContractFactory("ReentrancyDisperse");
      const attackerInstance = await attackerFactory.deploy(await contractInstance.getAddress(), ZeroAddress);

      const tx = contractInstance.disperseEther([await attackerInstance.getAddress()], [amount], {
        value: amount * 2n,
      });
      await expect(tx)
        .to.changeEtherBalances([await attackerInstance.getAddress()], [amount])
        .to.emit(attackerInstance, "Reentered")
        .withArgs(false);
    });

    it("should transfer ether to AOE", async function () {
      const [_owner, receiver] = await ethers.getSigners();

      const contractInstance = await factory();

      const tx = contractInstance.disperseEther([receiver.address], [amount], { value: amount });
      await expect(tx).to.changeEtherBalances([receiver.address], [amount]);
    });

    it("should not transfer to non receiver", async function () {
      const contractNonReceiverInstance = await deployJerk();

      const contractInstance = await factory();

      const tx = contractInstance.disperseEther([await contractNonReceiverInstance.getAddress()], [amount], {
        value: amount,
      });
      const dontFindLogs = await checkIfInLogs(tx, contractInstance, "TransferETH", [
        await contractNonReceiverInstance.getAddress(),
        amount,
      ]);
      expect(dontFindLogs).to.be.equal(false);
    });

    it("should transfer to contract receiver", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractNonReceiverInstance = await deployJerk();

      const contractInstance = await factory();

      const tx = contractInstance.disperseEther(
        [receiver.address, await contractNonReceiverInstance.getAddress()],
        [amount, amount],
        { value: amount * 2n },
      );
      await expect(tx)
        .to.emit(contractInstance, "TransferETH")
        .withArgs(receiver.address, amount)
        .to.changeEtherBalances([owner.address, receiver.address], [-amount, amount]);
    });

    it("should return back remaining ether", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractNonReceiverInstance = await deployJerk();

      const contractInstance = await factory();

      const tx = contractInstance.disperseEther(
        [receiver.address, await contractNonReceiverInstance.getAddress()],
        [amount, amount],
        { value: amount * 5n },
      );
      await expect(tx)
        .to.changeEtherBalances([owner.address, receiver.address], [-amount, amount])
        .to.emit(contractInstance, "TransferETH")
        .withArgs(receiver.address, amount);

      const findLog = await checkIfInLogs(tx, contractInstance, "TransferETH", [
        await contractNonReceiverInstance.getAddress(),
        amount,
      ]);
      expect(findLog).to.be.equal(false);
    });
  });

  describe("ERC20", function () {
    it("should fail: invalid Input", async function () {
      const [owner] = await ethers.getSigners();

      const contractInstance = await factory();
      const erc20Instance = await deployERC20();

      await erc20Instance.mint(owner.address, amount);
      await erc20Instance.approve(await contractInstance.getAddress(), amount);

      const tx = contractInstance.disperseERC20(await erc20Instance.getAddress(), [owner.address], []);
      await expect(tx).to.be.revertedWith("Disperse: Invalid input");
    });

    it("should transfer to AOE", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();
      const erc20Instance = await deployERC20();

      await erc20Instance.mint(owner.address, amount);
      await erc20Instance.approve(await contractInstance.getAddress(), amount);

      const tx = contractInstance.disperseERC20(await erc20Instance.getAddress(), [receiver.address], [amount]);

      await expect(tx)
        .to.emit(erc20Instance, "Transfer")
        .withArgs(owner.address, await contractInstance.getAddress(), amount)
        .to.emit(erc20Instance, "Transfer")
        .withArgs(await contractInstance.getAddress(), receiver.address, amount);
    });

    it("should transfer to non Receiver", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();
      const contractNonReceiver = await deployJerk();
      const erc20Instance = await deployERC20();

      await erc20Instance.mint(owner.address, amount);
      await erc20Instance.approve(await contractInstance.getAddress(), amount);

      const tx = contractInstance.disperseERC20(
        await erc20Instance.getAddress(),
        [await contractNonReceiver.getAddress()],
        [amount],
      );

      await expect(tx)
        .to.emit(erc20Instance, "Transfer")
        .withArgs(owner.address, await contractInstance.getAddress(), amount)
        .to.emit(erc20Instance, "Transfer")
        .withArgs(await contractInstance.getAddress(), await contractNonReceiver.getAddress(), amount);
    });

    it("should transfer to Receiver", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();
      const contractReceiver = await deployWallet();
      const erc20Instance = await deployERC20();

      await erc20Instance.mint(owner.address, amount);
      await erc20Instance.approve(await contractInstance.getAddress(), amount);

      const tx = contractInstance.disperseERC20(
        await erc20Instance.getAddress(),
        [await contractReceiver.getAddress()],
        [amount],
      );

      await expect(tx)
        .to.emit(erc20Instance, "Transfer")
        .withArgs(owner.address, await contractInstance.getAddress(), amount)
        .to.emit(erc20Instance, "Transfer")
        .withArgs(await contractInstance.getAddress(), await contractReceiver.getAddress(), amount);
    });
  });

  describe("ERC721", function () {
    it("should fail: invalid Input", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();
      const erc721Instance = await deployERC721();

      const tx = contractInstance.disperseERC721(await erc721Instance.getAddress(), [owner.address], []);
      await expect(tx).to.be.revertedWith("Disperse: Invalid input");
    });

    it("should transfer to AOE", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();
      const erc721Instance = await deployERC721();

      await erc721Instance.mintCommon(owner.address, templateId);
      await erc721Instance.approve(await contractInstance.getAddress(), 1);

      // Call the function and capture the transaction response
      const tx = contractInstance.disperseERC721(await erc721Instance.getAddress(), [receiver.address], [1]);

      await expect(tx).to.emit(erc721Instance, "Transfer").withArgs(owner.address, receiver.address, 1);
    });

    it("should not transfer to non receiver", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();
      const contractNonReceiver = await deployJerk();
      const erc721Instance = await deployERC721();

      await erc721Instance.mintCommon(owner.address, templateId);
      await erc721Instance.approve(await contractInstance.getAddress(), 1);

      // Call the function and capture the transaction response
      const tx = contractInstance.disperseERC721(
        await erc721Instance.getAddress(),
        [await contractNonReceiver.getAddress()],
        [1],
      );

      const dontFindLogs = await checkIfInLogs(tx, erc721Instance, "Transfer", [
        await contractNonReceiver.getAddress(),
        1,
      ]);
      expect(dontFindLogs).to.be.equal(false);
    });

    it("should transfer to receiver", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();
      const contractReceiver = await deployWallet();
      const erc721Instance = await deployERC721();

      await erc721Instance.mintCommon(owner.address, templateId);
      await erc721Instance.approve(await contractInstance.getAddress(), 1);

      // Call the function and capture the transaction response
      const tx = contractInstance.disperseERC721(
        await erc721Instance.getAddress(),
        [await contractReceiver.getAddress()],
        [1],
      );

      await expect(tx)
        .to.emit(erc721Instance, "Transfer")
        .withArgs(owner.address, await contractReceiver.getAddress(), 1);
    });

    it("should have reentrancy guard", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();
      const erc721Instance = await deployERC721();

      const attackerFactory = await ethers.getContractFactory("ReentrancyDisperse");
      const attackerInstance = await attackerFactory.deploy(
        await contractInstance.getAddress(),
        await erc721Instance.getAddress(),
      );

      await erc721Instance.mintCommon(owner.address, templateId);
      await erc721Instance.mintCommon(owner.address, templateId);
      await erc721Instance.setApprovalForAll(await contractInstance.getAddress(), true);

      const tx = contractInstance.disperseERC721(
        await erc721Instance.getAddress(),
        [await attackerInstance.getAddress()],
        [1],
      );
      await expect(tx)
        .to.emit(erc721Instance, "Transfer")
        .withArgs(owner.address, await attackerInstance.getAddress(), 1)
        .to.emit(attackerInstance, "Reentered")
        .withArgs(false);
    });
  });

  describe("ERC1155", function () {
    it("should fail: invalid Input", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();
      const erc1155Instance = await deployERC1155();

      const tx = contractInstance.disperseERC1155(await erc1155Instance.getAddress(), [owner.address], [], [amount]);
      await expect(tx).to.be.revertedWith("Disperse: Invalid input");
      const tx2 = contractInstance.disperseERC1155(await erc1155Instance.getAddress(), [owner.address], [tokenId], []);
      await expect(tx2).to.be.revertedWith("Disperse: Invalid input");
    });

    it("should transfer to AOE", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();
      const erc1155Instance = await deployERC1155();

      await erc1155Instance.mint(owner.address, tokenId, amount, "0x");
      await erc1155Instance.setApprovalForAll(await contractInstance.getAddress(), true);

      // Call the function and capture the transaction response
      const tx = contractInstance.disperseERC1155(
        await erc1155Instance.getAddress(),
        [receiver.address],
        [tokenId],
        [amount],
      );

      await expect(tx)
        .to.emit(erc1155Instance, "TransferSingle")
        .withArgs(await contractInstance.getAddress(), owner.address, receiver.address, tokenId, amount);
    });

    it("should not transfer to non receiver", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();
      const contractNonReceiver = await deployJerk();
      const erc1155Instance = await deployERC1155();

      await erc1155Instance.mint(owner.address, tokenId, amount, "0x");
      await erc1155Instance.setApprovalForAll(await contractInstance.getAddress(), true);

      // Call the function and capture the transaction response
      const tx = contractInstance.disperseERC1155(
        await erc1155Instance.getAddress(),
        [await contractNonReceiver.getAddress()],
        [tokenId],
        [amount],
      );

      const findLogs = await checkIfInLogs(tx, erc1155Instance, "TransferSingle", [
        await contractInstance.getAddress(),
        owner.address,
        await contractNonReceiver.getAddress(),
        tokenId,
        amount,
      ]);
      expect(findLogs).to.be.equal(false);
    });

    it("should transfer to receiver", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();
      const contractReceiver = await deployWallet();
      const erc1155Instance = await deployERC1155();

      await erc1155Instance.mint(owner.address, tokenId, amount, "0x");
      await erc1155Instance.setApprovalForAll(await contractInstance.getAddress(), true);

      // Call the function and capture the transaction response
      const tx = contractInstance.disperseERC1155(
        await erc1155Instance.getAddress(),
        [await contractReceiver.getAddress()],
        [tokenId],
        [amount],
      );

      await expect(tx)
        .to.emit(erc1155Instance, "TransferSingle")
        .withArgs(
          await contractInstance.getAddress(),
          owner.address,
          await contractReceiver.getAddress(),
          tokenId,
          amount,
        );
    });

    it("should have reentrancy guard", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();
      const erc1155Instance = await deployERC1155();

      const attackerFactory = await ethers.getContractFactory("ReentrancyDisperse");
      const attackerInstance = await attackerFactory.deploy(
        await contractInstance.getAddress(),
        await erc1155Instance.getAddress(),
      );

      await erc1155Instance.mint(owner.address, tokenId, amount * 2n, "0x");
      await erc1155Instance.setApprovalForAll(await contractInstance.getAddress(), true);

      const tx = contractInstance.disperseERC1155(
        await erc1155Instance.getAddress(),
        [await attackerInstance.getAddress()],
        [tokenId],
        [amount],
      );
      await expect(tx)
        .to.emit(erc1155Instance, "TransferSingle")
        .withArgs(
          await contractInstance.getAddress(),
          owner.address,
          await attackerInstance.getAddress(),
          tokenId,
          amount,
        )
        .to.emit(attackerInstance, "Reentered")
        .withArgs(false);
    });
  });

  describe("Test gas", function () {
    const totalTransfers = 100n;

    describe("ETH", function () {
      it(`should transfer ETH to ${totalTransfers} receivers`, async function () {
        const [_, receiver] = await ethers.getSigners();
        const contractInstance = await factory();

        const listOfArgs = new Array(Number(totalTransfers)).fill(null).map(_ => [receiver.address, amount]);
        const receivers = new Array(Number(totalTransfers)).fill(null).map(_ => receiver.address);
        const amounts = new Array(Number(totalTransfers)).fill(null).map(_ => amount);

        // Call the function and capture the transaction response
        const tx = contractInstance.disperseEther(receivers, amounts, { value: amount * totalTransfers });

        for (const args of listOfArgs) {
          await expect(tx)
            .to.emit(contractInstance, "TransferETH")
            .withArgs(...args);
        }
      });
    });

    describe("ERC20", function () {
      it(`should transfer to ${totalTransfers} signers`, async function () {
        const [owner, receiver] = await ethers.getSigners();
        const contractInstance = await factory();
        const erc20Instance = await deployERC20();

        await erc20Instance.mint(owner.address, amount);
        await erc20Instance.approve(await contractInstance.getAddress(), amount);

        const address: string = await contractInstance.getAddress();
        const listOfArgs = new Array(Number(totalTransfers))
          .fill(null)
          .map(_ => [address, receiver.address, amount / totalTransfers]);
        const receivers = new Array(Number(totalTransfers)).fill(null).map(_ => receiver.address);
        const amounts = new Array(Number(totalTransfers)).fill(null).map(_ => amount / totalTransfers);

        // Call the function and capture the transaction response
        const tx = contractInstance.disperseERC20(await erc20Instance.getAddress(), receivers, amounts);

        for (const args of listOfArgs) {
          await expect(tx)
            .to.emit(erc20Instance, "Transfer")
            .withArgs(...args);
        }
      });
    });

    describe("ERC721", function () {
      it(`should transfer to ${totalTransfers} signers`, async function () {
        const [owner, receiver] = await ethers.getSigners();
        const contractInstance = await factory();
        const erc721Instance = await deployERC721();

        for (let i = 0; i < totalTransfers; i++) {
          await erc721Instance.mintCommon(owner.address, templateId);
        }
        await erc721Instance.setApprovalForAll(await contractInstance.getAddress(), true);

        const listOfArgs = new Array(Number(totalTransfers))
          .fill(null)
          .map((_, i) => [owner.address, receiver.address, i + 1]);
        const receivers = new Array(Number(totalTransfers)).fill(null).map(_ => receiver.address);
        const tokenIds = new Array(Number(totalTransfers)).fill(null).map((_, i) => i + 1);

        // Call the function and capture the transaction response
        const tx = contractInstance.disperseERC721(await erc721Instance.getAddress(), receivers, tokenIds, {
          gasLimit: 40966424,
        });

        for (const args of listOfArgs) {
          await expect(tx)
            .to.emit(erc721Instance, "Transfer")
            .withArgs(...args);
        }
      });
    });

    describe("ERC1155", function () {
      it(`should transfer to ${totalTransfers} signers`, async function () {
        const [owner, receiver] = await ethers.getSigners();
        const contractInstance = await factory();
        const erc1155Instance = await deployERC1155();

        await erc1155Instance.mint(owner.address, tokenId, amount * totalTransfers, "0x");
        await erc1155Instance.setApprovalForAll(await contractInstance.getAddress(), true);

        const address: string = await contractInstance.getAddress();
        const listOfArgs = new Array(Number(totalTransfers))
          .fill(null)
          .map(_ => [address, owner.address, receiver.address, 1, amount]);
        const receivers = new Array(Number(totalTransfers)).fill(null).map(_ => receiver.address);
        const tokenIds = new Array(Number(totalTransfers)).fill(null).map((_, i) => i + 1);
        const amounts = new Array(Number(totalTransfers)).fill(null).map(_ => amount);

        // Call the function and capture the transaction response
        const tx = contractInstance.disperseERC1155(await erc1155Instance.getAddress(), receivers, tokenIds, amounts, {
          gasLimit: 40966424,
        });

        for (const args of listOfArgs) {
          await expect(tx)
            .to.emit(erc1155Instance, "TransferSingle")
            .withArgs(...args);
        }
      });
    });
  });

  shouldSupportsInterface(factory)([
    "0x99ac1b00", // IDisperse
  ]);
});
