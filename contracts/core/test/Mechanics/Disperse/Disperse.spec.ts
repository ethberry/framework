import { expect } from "chai";
import { ethers } from "hardhat";
import { constants } from "ethers";

import { amount } from "@gemunion/contracts-constants";
import { deployContract, deployJerk, deployWallet } from "@gemunion/contracts-mocks";

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
      const attackerFactory = await ethers.getContractFactory("ReentrancyDisperse");
      const attackerInstance = await attackerFactory.deploy(contractInstance.address, constants.AddressZero);

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
      const [owner, receiver] = await ethers.getSigners();
      const contractNonReceiverInstance = await deployJerk();

      const contractInstance = await factory();

      const tx = contractInstance.disperseEther(
        [receiver.address, contractNonReceiverInstance.address],
        [amount, amount],
        { value: amount * 5 },
      );
      await expect(tx)
        .to.changeEtherBalances([owner.address, receiver.address], [-amount, amount])
        .to.emit(contractInstance, "TransferETH")
        .withArgs(receiver.address, amount);

      const findLog = await checkIfInLogs(tx, contractInstance, "TransferETH", [
        contractNonReceiverInstance.address,
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

      const attackerFactory = await ethers.getContractFactory("ReentrancyDisperse");
      const attackerInstance = await attackerFactory.deploy(contractInstance.address, erc721Instance.address);

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

      const attackerFactory = await ethers.getContractFactory("ReentrancyDisperse");
      const attackerInstance = await attackerFactory.deploy(contractInstance.address, erc1155Instance.address);

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

  describe("Test gas", function () {
    const totalTransfers = 100;

    describe("ETH", function () {
      it(`should transfer ETH to ${totalTransfers} receivers`, async function () {
        const [_, receiver] = await ethers.getSigners();
        const contractInstance = await factory();

        const listOfArgs = new Array(totalTransfers).fill(null).map(_ => [receiver.address, amount]);
        const receivers = new Array(totalTransfers).fill(null).map(_ => receiver.address);
        const amounts = new Array(totalTransfers).fill(null).map(_ => amount);

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
        await erc20Instance.approve(contractInstance.address, amount);

        const listOfArgs = new Array(totalTransfers)
          .fill(null)
          .map(_ => [contractInstance.address, receiver.address, amount / totalTransfers]);
        const receivers = new Array(totalTransfers).fill(null).map(_ => receiver.address);
        const amounts = new Array(totalTransfers).fill(null).map(_ => amount / totalTransfers);

        // Call the function and capture the transaction response
        const tx = contractInstance.disperseERC20(erc20Instance.address, receivers, amounts);

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
        await erc721Instance.setApprovalForAll(contractInstance.address, true);

        const listOfArgs = new Array(totalTransfers).fill(null).map((_, i) => [owner.address, receiver.address, i + 1]);
        const receivers = new Array(totalTransfers).fill(null).map(_ => receiver.address);
        const tokenIds = new Array(totalTransfers).fill(null).map((_, i) => i + 1);

        // Call the function and capture the transaction response
        const tx = contractInstance.disperseERC721(erc721Instance.address, receivers, tokenIds, {
          gasLimit: 10000000000,
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
        await erc1155Instance.setApprovalForAll(contractInstance.address, true);

        const listOfArgs = new Array(totalTransfers)
          .fill(null)
          .map(_ => [contractInstance.address, owner.address, receiver.address, 1, amount]);
        const receivers = new Array(totalTransfers).fill(null).map(_ => receiver.address);
        const tokenIds = new Array(totalTransfers).fill(null).map((_, i) => i + 1);
        const amounts = new Array(totalTransfers).fill(null).map(_ => amount);

        // Call the function and capture the transaction response
        const tx = contractInstance.disperseERC1155(erc1155Instance.address, receivers, tokenIds, amounts, {
          gasLimit: 10000000000,
        });

        for (const args of listOfArgs) {
          await expect(tx)
            .to.emit(erc1155Instance, "TransferSingle")
            .withArgs(...args);
        }
      });
    });
  });
});
