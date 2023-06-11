import { expect } from "chai";
import { ethers } from "hardhat";
import { ZeroAddress } from "ethers";

import { deployJerk, deployWallet } from "@gemunion/contracts-mocks";
import { batchSize, MINTER_ROLE } from "@gemunion/contracts-constants";

import { tokenId } from "../../../constants";

export function shouldMintCommon(factory: () => Promise<any>) {
  describe("mintCommon", function () {
    it("should mint to wallet", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const tx = contractInstance.mintCommon(receiver.address, batchSize + tokenId);
      await expect(tx)
        .to.emit(contractInstance, "Transfer")
        .withArgs(ZeroAddress, receiver.address, batchSize + tokenId);

      const balance = await contractInstance.balanceOf(receiver.address);
      expect(balance).to.equal(1);
    });

    it("should mint to receiver", async function () {
      const contractInstance = await factory();
      const erc721ReceiverInstance = await deployWallet();

      const tx = contractInstance.mintCommon(await erc721ReceiverInstance.getAddress(), batchSize + tokenId);
      await expect(tx)
        .to.emit(contractInstance, "Transfer")
        .withArgs(ZeroAddress, await erc721ReceiverInstance.getAddress(), batchSize + tokenId);

      const balance = await contractInstance.balanceOf(await erc721ReceiverInstance.getAddress());
      expect(balance).to.equal(1);
    });

    it("should fail: wrong role", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const tx = contractInstance.connect(receiver).mintCommon(receiver.address, batchSize + tokenId);
      await expect(tx).to.be.revertedWith(
        `AccessControl: account ${receiver.address.toLowerCase()} is missing role ${MINTER_ROLE}`,
      );
    });

    it("should fail: to mint to non receiver", async function () {
      const contractInstance = await factory();
      const erc721NonReceiverInstance = await deployJerk();

      const tx = contractInstance.mintCommon(await erc721NonReceiverInstance.getAddress(), batchSize + tokenId);
      await expect(tx).to.be.revertedWith(`ERC721: transfer to non ERC721Receiver implementer`);
    });
  });
}
