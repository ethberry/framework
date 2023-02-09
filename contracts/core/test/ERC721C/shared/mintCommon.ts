import { expect } from "chai";
import { ethers } from "hardhat";
import { constants, Contract } from "ethers";

import { deployErc721NonReceiver, deployErc721Receiver } from "@gemunion/contracts-mocks";
import { MINTER_ROLE, tokenInitialAmount } from "@gemunion/contracts-constants";

import { tokenId } from "../../constants";

export function shouldMintCommon(factory: () => Promise<Contract>) {
  describe("mintCommon", function () {
    it("should mint to wallet", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const tx = contractInstance.mintCommon(receiver.address, tokenInitialAmount + tokenId);
      await expect(tx)
        .to.emit(contractInstance, "Transfer")
        .withArgs(constants.AddressZero, receiver.address, tokenInitialAmount + tokenId);

      const balance = await contractInstance.balanceOf(receiver.address);
      expect(balance).to.equal(1);
    });

    it("should mint to receiver", async function () {
      const contractInstance = await factory();
      const erc721ReceiverInstance = await deployErc721Receiver();

      const tx = contractInstance.mintCommon(erc721ReceiverInstance.address, tokenInitialAmount + tokenId);
      await expect(tx)
        .to.emit(contractInstance, "Transfer")
        .withArgs(constants.AddressZero, erc721ReceiverInstance.address, tokenInitialAmount + tokenId);

      const balance = await contractInstance.balanceOf(erc721ReceiverInstance.address);
      expect(balance).to.equal(1);
    });

    it("should fail: wrong role", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const contractInstance = await factory();

      const tx = contractInstance.connect(receiver).mintCommon(receiver.address, tokenInitialAmount + tokenId);
      await expect(tx).to.be.revertedWith(
        `AccessControl: account ${receiver.address.toLowerCase()} is missing role ${MINTER_ROLE}`,
      );
    });

    it("should fail: to mint to non receiver", async function () {
      const contractInstance = await factory();
      const erc721NonReceiverInstance = await deployErc721NonReceiver();

      const tx = contractInstance.mintCommon(erc721NonReceiverInstance.address, tokenInitialAmount + tokenId);
      await expect(tx).to.be.revertedWith(`ERC721: transfer to non ERC721Receiver implementer`);
    });
  });
}
