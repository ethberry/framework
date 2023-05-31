import { expect } from "chai";
import { ethers } from "hardhat";
import { amount } from "@gemunion/contracts-constants";

import { deployDisperse } from "./shared/fixtures";
import { deployERC20 } from "../../ERC20/shared/fixtures";
import { checkIfInLogs } from "./shared/utils";
import { Wallet, constants } from "ethers";
import { deployJerk, deployWallet } from "@gemunion/contracts-mocks";
import { deployERC721 } from "../../ERC721/shared/fixtures";
import { templateId, tokenId } from "../../constants";
import { deployERC1155 } from "../../ERC1155/shared/fixtures";

describe("Disperse", function () {
  const factory = () => deployDisperse();
  describe("Ether", function () {
    it("should fail: deposit ether", async function () {
      const [owner] = await ethers.getSigners();

      const contractInstance = await factory();
      const tx = owner.sendTransaction({ to: contractInstance.address, value: amount });
      await expect(tx).to.be.revertedWithoutReason();
    });

    it("should fail: not enough ether", async function () {
      const [_, receiver] = await ethers.getSigners();

      const contractInstance = await factory();

      const tx = contractInstance.disperseEther([receiver.address], [amount], { value: amount / 2 });
      await expect(tx).to.be.revertedWithCustomError(contractInstance, "NotEnoughBalance");
    });

    it("should fail: invalid Input", async function () {
      const [_, receiver] = await ethers.getSigners();

      const contractInstance = await factory();

      const tx = contractInstance.disperseEther([receiver.address], [], { value: amount });
      await expect(tx).to.be.revertedWith("Disperse: Invalid input");
    });

    it("should have reentrancy guard", async function () {
      const [_owner] = await ethers.getSigners();
      const contractInstance = await factory();
      const AttackerFactory = await ethers.getContractFactory("ReentrancyDisperse");
      const attackerInstance = await AttackerFactory.deploy(contractInstance.address, constants.AddressZero);

      const tx = contractInstance.disperseEther([attackerInstance.address], [amount], { value: amount * 2 });
      await expect(tx)
        .to.changeEtherBalances([attackerInstance.address], [amount])
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

      const tx = contractInstance.disperseEther([contractNonReceiverInstance.address], [amount], { value: amount });
      const dontFindLogs = await checkIfInLogs(tx, contractInstance, "TransferETH", [
        contractNonReceiverInstance.address,
        amount,
      ]);
      expect(dontFindLogs).to.be.equal(false);
    });

    it("should transfer to contract receiver", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractNonReceiverInstance = await deployJerk();

      const contractInstance = await factory();

      const tx = contractInstance.disperseEther(
        [receiver.address, contractNonReceiverInstance.address],
        [amount, amount],
        { value: amount * 2 },
      );
      await expect(tx)
        .to.emit(contractInstance, "TransferETH")
        .withArgs(receiver.address, amount)
        .to.changeEtherBalances([owner.address, receiver.address], [-amount, amount]);
    });

    it("should return back remaining ether", async function () {
      const contractNonReceiverInstance = await deployJerk();

      const contractInstance = await factory();

      const tx = contractInstance.disperseEther([contractNonReceiverInstance.address], [amount], { value: amount });
      const dontFindLogs = await checkIfInLogs(tx, contractInstance, "TransferETH", [
        contractNonReceiverInstance.address,
        amount,
      ]);
      expect(dontFindLogs).to.be.equal(false);
    });
  });

  describe("ERC20", function () {
    it("should fail: invalid Input", async function () {
      const [owner] = await ethers.getSigners();

      const contractInstance = await factory();
      const erc20Instance = await deployERC20();

      await erc20Instance.mint(owner.address, amount);
      await erc20Instance.approve(contractInstance.address, amount);

      const tx = contractInstance.disperseERC20(erc20Instance.address, [owner.address], []);
      await expect(tx).to.be.revertedWith("Disperse: Invalid input");
    });

    it("should transfer to AOE", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();
      const erc20Instance = await deployERC20();

      await erc20Instance.mint(owner.address, amount);
      await erc20Instance.approve(contractInstance.address, amount);

      const tx = contractInstance.disperseERC20(erc20Instance.address, [receiver.address], [amount]);

      await expect(tx)
        .to.emit(erc20Instance, "Transfer")
        .withArgs(owner.address, contractInstance.address, amount)
        .to.emit(erc20Instance, "Transfer")
        .withArgs(contractInstance.address, receiver.address, amount);
    });

    it("should transfer to non Receiver", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();
      const contractNonReceiver = await deployJerk();
      const erc20Instance = await deployERC20();

      await erc20Instance.mint(owner.address, amount);
      await erc20Instance.approve(contractInstance.address, amount);

      const tx = contractInstance.disperseERC20(erc20Instance.address, [contractNonReceiver.address], [amount]);

      await expect(tx)
        .to.emit(erc20Instance, "Transfer")
        .withArgs(owner.address, contractInstance.address, amount)
        .to.emit(erc20Instance, "Transfer")
        .withArgs(contractInstance.address, contractNonReceiver.address, amount);
    });

    it("should transfer to Receiver", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();
      const contractReceiver = await deployWallet();
      const erc20Instance = await deployERC20();

      await erc20Instance.mint(owner.address, amount);
      await erc20Instance.approve(contractInstance.address, amount);

      const tx = contractInstance.disperseERC20(erc20Instance.address, [contractReceiver.address], [amount]);

      await expect(tx)
        .to.emit(erc20Instance, "Transfer")
        .withArgs(owner.address, contractInstance.address, amount)
        .to.emit(erc20Instance, "Transfer")
        .withArgs(contractInstance.address, contractReceiver.address, amount);
    });
  });

  describe("ERC721", function () {
    it("should fail: invalid Input", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();
      const erc721Instance = await deployERC721();

      const tx = contractInstance.disperseERC721(erc721Instance.address, [owner.address], []);
      await expect(tx).to.be.revertedWith("Disperse: Invalid input");
    });

    it("should transfer to AOE", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();
      const erc721Instance = await deployERC721();

      await erc721Instance.mintCommon(owner.address, templateId);
      await erc721Instance.approve(contractInstance.address, 1);

      // Call the function and capture the transaction response
      const tx = contractInstance.disperseERC721(erc721Instance.address, [receiver.address], [1]);

      await expect(tx).to.emit(erc721Instance, "Transfer").withArgs(owner.address, receiver.address, 1);
    });

    it("should not transfer to non receiver", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();
      const contractNonReceiver = await deployJerk();
      const erc721Instance = await deployERC721();

      await erc721Instance.mintCommon(owner.address, templateId);
      await erc721Instance.approve(contractInstance.address, 1);

      // Call the function and capture the transaction response
      const tx = contractInstance.disperseERC721(erc721Instance.address, [contractNonReceiver.address], [1]);

      const dontFindLogs = await checkIfInLogs(tx, erc721Instance, "Transfer", [contractNonReceiver.address, 1]);
      expect(dontFindLogs).to.be.equal(false);
    });

    it("should transfer to receiver", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();
      const contractReceiver = await deployWallet();
      const erc721Instance = await deployERC721();

      await erc721Instance.mintCommon(owner.address, templateId);
      await erc721Instance.approve(contractInstance.address, 1);

      // Call the function and capture the transaction response
      const tx = contractInstance.disperseERC721(erc721Instance.address, [contractReceiver.address], [1]);

      await expect(tx).to.emit(erc721Instance, "Transfer").withArgs(owner.address, contractReceiver.address, 1);
    });

    it("should have reentrancy guard", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();
      const erc721Instance = await deployERC721();

      const AttackerFactory = await ethers.getContractFactory("ReentrancyDisperse");
      const attackerInstance = await AttackerFactory.deploy(contractInstance.address, erc721Instance.address);

      await erc721Instance.mintCommon(owner.address, templateId);
      await erc721Instance.mintCommon(owner.address, templateId);
      await erc721Instance.setApprovalForAll(contractInstance.address, true);

      const tx = contractInstance.disperseERC721(erc721Instance.address, [attackerInstance.address], [1]);
      await expect(tx)
        .to.emit(erc721Instance, "Transfer")
        .withArgs(owner.address, attackerInstance.address, 1)
        .to.emit(attackerInstance, "Reentered")
        .withArgs(false);
    });
  });

  describe("ERC1155", function () {
    it("should fail: invalid Input", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();
      const erc1155Instance = await deployERC1155();

      const tx = contractInstance.disperseERC1155(erc1155Instance.address, [owner.address], [], [amount]);
      await expect(tx).to.be.revertedWith("Disperse: Invalid input");
      const tx2 = contractInstance.disperseERC1155(erc1155Instance.address, [owner.address], [tokenId], []);
      await expect(tx2).to.be.revertedWith("Disperse: Invalid input");
    });

    it("should transfer to AOE", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();
      const erc1155Instance = await deployERC1155();

      await erc1155Instance.mint(owner.address, tokenId, amount, "0x");
      await erc1155Instance.setApprovalForAll(contractInstance.address, true);

      // Call the function and capture the transaction response
      const tx = contractInstance.disperseERC1155(erc1155Instance.address, [receiver.address], [tokenId], [amount]);

      await expect(tx)
        .to.emit(erc1155Instance, "TransferSingle")
        .withArgs(contractInstance.address, owner.address, receiver.address, tokenId, amount);
    });

    it("should not transfer to non receiver", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();
      const contractNonReceiver = await deployJerk();
      const erc1155Instance = await deployERC1155();

      await erc1155Instance.mint(owner.address, tokenId, amount, "0x");
      await erc1155Instance.setApprovalForAll(contractInstance.address, true);

      // Call the function and capture the transaction response
      const tx = contractInstance.disperseERC1155(
        erc1155Instance.address,
        [contractNonReceiver.address],
        [tokenId],
        [amount],
      );

      const findLogs = await checkIfInLogs(tx, erc1155Instance, "TransferSingle", [
        contractInstance.address,
        owner.address,
        contractNonReceiver.address,
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
      await erc1155Instance.setApprovalForAll(contractInstance.address, true);

      // Call the function and capture the transaction response
      const tx = contractInstance.disperseERC1155(
        erc1155Instance.address,
        [contractReceiver.address],
        [tokenId],
        [amount],
      );

      await expect(tx)
        .to.emit(erc1155Instance, "TransferSingle")
        .withArgs(contractInstance.address, owner.address, contractReceiver.address, tokenId, amount);
    });

    it("should have reentrancy guard", async function () {
      const [owner] = await ethers.getSigners();
      const contractInstance = await factory();
      const erc1155Instance = await deployERC1155();

      const AttackerFactory = await ethers.getContractFactory("ReentrancyDisperse");
      const attackerInstance = await AttackerFactory.deploy(contractInstance.address, erc1155Instance.address);

      await erc1155Instance.mint(owner.address, tokenId, amount * 2, "0x");
      await erc1155Instance.setApprovalForAll(contractInstance.address, true);

      const tx = contractInstance.disperseERC1155(
        erc1155Instance.address,
        [attackerInstance.address],
        [tokenId],
        [amount],
      );
      await expect(tx)
        .to.emit(erc1155Instance, "TransferSingle")
        .withArgs(contractInstance.address, owner.address, attackerInstance.address, tokenId, amount)
        .to.emit(attackerInstance, "Reentered")
        .withArgs(false);
    });
  });

  describe.skip("Test gas", function () {
    const totalTransfers = 100;

    describe("ETH", function () {
      it(`should transfer ETH to ${totalTransfers} receivers`, async function () {
        const [owner] = await ethers.getSigners();
        const contractInstance = await factory();
        const erc20Instance = await deployERC20();

        await erc20Instance.mint(owner.address, amount);
        await erc20Instance.approve(contractInstance.address, amount);

        const amountOfFails = 10;
        const receivers = [];
        const amounts = [];
        const haveToSuccess = [];
        const haveToFail = [];

        for (let i = 0; i < totalTransfers; i++) {
          if (i % amountOfFails === amountOfFails - 1) {
            const jerkInstance = await deployJerk();
            receivers.push(jerkInstance.address);
            amounts.push(amount);
            haveToFail.push([jerkInstance.address, amount]);
          } else {
            const randomWallet = Wallet.createRandom();
            receivers.push(randomWallet.address);
            amounts.push(amount);
            haveToSuccess.push([randomWallet.address, amount]);
          }
        }

        // Call the function and capture the transaction response
        const tx = contractInstance.disperseEther(receivers, amounts, { value: amount * totalTransfers });

        for (const args of haveToSuccess) {
          await expect(tx)
            .to.emit(contractInstance, "TransferETH")
            .withArgs(...args);
        }
        // This event's have not to be emitted.
        for (const args of haveToFail) {
          const dontFindLogs = await checkIfInLogs(tx, contractInstance, "TransferETH", args);
          expect(dontFindLogs).to.be.equal(false);
        }
      });
    });

    describe("ERC20", function () {
      it(`should transfer to ${totalTransfers} signers`, async function () {
        const [owner] = await ethers.getSigners();
        const contractInstance = await factory();
        const erc20Instance = await deployERC20();

        await erc20Instance.mint(owner.address, amount);
        await erc20Instance.approve(contractInstance.address, amount);

        const sendAmount = amount / totalTransfers;
        const receivers = [];
        const amounts = [];
        const haveToSuccess = [];

        for (let i = 0; i < totalTransfers; i++) {
          const receiver = Wallet.createRandom();
          haveToSuccess.push([contractInstance.address, receiver.address, sendAmount]);
          receivers.push(receiver.address);
          amounts.push(sendAmount);
        }

        // Call the function and capture the transaction response
        const tx = contractInstance.disperseERC20(erc20Instance.address, receivers, amounts);

        for (const args of haveToSuccess) {
          await expect(tx)
            .to.emit(erc20Instance, "Transfer")
            .withArgs(...args);
        }
      });
    });

    describe("ERC721", function () {
      it(`should transfer to ${totalTransfers} signers`, async function () {
        const [owner] = await ethers.getSigners();
        const contractInstance = await factory();
        const erc721Instance = await deployERC721();

        for (let i = 0; i < totalTransfers; i++) {
          await erc721Instance.mintCommon(owner.address, templateId);
        }
        await erc721Instance.setApprovalForAll(contractInstance.address, true);

        const amountOfFails = 10;
        const receivers = [];
        const tokenIds = [];
        const haveToSuccess = [];
        const haveToFail = [];

        for (let i = 0; i < totalTransfers; i++) {
          const tokenId = i + 1;
          if (i % amountOfFails === amountOfFails - 1) {
            const jerkInstance = await deployJerk();
            receivers.push(jerkInstance.address);
            tokenIds.push(tokenId); // tokenId start from 1
            haveToFail.push([owner.address, jerkInstance.address, tokenId]);
          } else {
            const randomWallet = Wallet.createRandom();
            receivers.push(randomWallet.address);
            tokenIds.push(tokenId); // tokenId start from 1
            haveToSuccess.push([owner.address, randomWallet.address, tokenId]);
          }
        }

        // Call the function and capture the transaction response
        const tx = contractInstance.disperseERC721(erc721Instance.address, receivers, tokenIds, {
          gasLimit: 10000000000,
        });

        for (const args of haveToSuccess) {
          await expect(tx)
            .to.emit(erc721Instance, "Transfer")
            .withArgs(...args);
        }
        // This event's have not to be emitted.
        for (const args of haveToFail) {
          const dontFindLogs = await checkIfInLogs(tx, erc721Instance, "Transfer", args);
          expect(dontFindLogs).to.be.equal(false);
        }
      });
    });

    describe("ERC1155", function () {
      it(`should transfer to ${totalTransfers} signers`, async function () {
        const [owner] = await ethers.getSigners();
        const contractInstance = await factory();
        const erc1155Instance = await deployERC1155();

        await erc1155Instance.mint(owner.address, tokenId, amount * totalTransfers, "0x");
        await erc1155Instance.setApprovalForAll(contractInstance.address, true);

        const amountOfFails = 10;
        const receivers = [];
        const tokenIds = [];
        const amounts = [];
        const haveToSuccess = [];
        const haveToFail = [];

        for (let i = 0; i < totalTransfers; i++) {
          if (i % amountOfFails === amountOfFails - 1) {
            const jerkInstance = await deployJerk();
            receivers.push(jerkInstance.address);
            tokenIds.push(1);
            amounts.push(amount);
            haveToFail.push([contractInstance.address, owner.address, jerkInstance.address, 1, amount]);
          } else {
            const randomWallet = Wallet.createRandom();
            receivers.push(randomWallet.address);
            tokenIds.push(1);
            amounts.push(amount);
            haveToSuccess.push([contractInstance.address, owner.address, randomWallet.address, 1, amount]);
          }
        }

        // Call the function and capture the transaction response
        const tx = contractInstance.disperseERC1155(erc1155Instance.address, receivers, tokenIds, amounts, {
          gasLimit: 10000000000,
        });

        for (const args of haveToSuccess) {
          await expect(tx)
            .to.emit(erc1155Instance, "TransferSingle")
            .withArgs(...args);
        }
        // This event's have not to be emitted.
        for (const args of haveToFail) {
          const dontFindLogs = await checkIfInLogs(tx, erc1155Instance, "TransferSingle", args);
          expect(dontFindLogs).to.be.equal(false);
        }
      });
    });
  });
});
