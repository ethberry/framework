import { expect } from "chai";
import { ethers } from "hardhat";
import { constants } from "ethers";

import { accessControlInterfaceId, DEFAULT_ADMIN_ROLE } from "../../../../constants";
import { deployErc1155Base } from "../../fixtures";

export function shouldSetDefaultRoyalty(name: string) {
  describe("setDefaultRoyalty", function () {
    it("should set token royalty", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const { contractInstance } = await deployErc1155Base(name);

      const royalty = 5000;

      const tx = contractInstance.setDefaultRoyalty(receiver.address, royalty);
      await expect(tx).to.emit(contractInstance, "DefaultRoyaltyInfo").withArgs(receiver.address, royalty);
    });

    it("should fail: royalty fee will exceed salePrice", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const { contractInstance } = await deployErc1155Base(name);

      const royalty = 11000;

      const tx = contractInstance.setDefaultRoyalty(receiver.address, royalty * royalty);
      await expect(tx).to.be.revertedWith("ERC2981: royalty fee will exceed salePrice");
    });

    it("should fail: invalid parameters", async function () {
      const { contractInstance } = await deployErc1155Base(name);

      const royalty = 5000;

      const tx = contractInstance.setDefaultRoyalty(constants.AddressZero, royalty);
      await expect(tx).to.be.revertedWith("ERC2981: invalid receiver");
    });

    it("should fail: account is missing role", async function () {
      const [_owner, receiver] = await ethers.getSigners();
      const { contractInstance } = await deployErc1155Base(name);

      const royalty = 5000;

      const supportsAccessControl = await contractInstance.supportsInterface(accessControlInterfaceId);

      const tx = contractInstance.connect(receiver).setDefaultRoyalty(receiver.address, royalty);
      await expect(tx).to.be.revertedWith(
        supportsAccessControl
          ? `AccessControl: account ${receiver.address.toLowerCase()} is missing role ${DEFAULT_ADMIN_ROLE}`
          : "Ownable: caller is not the owner",
      );
    });
  });
}
