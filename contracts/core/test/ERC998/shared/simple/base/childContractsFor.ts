import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";

import { InterfaceId } from "@gemunion/contracts-constants";

import { deployERC721 } from "../../../../ERC721/shared/fixtures";
import { templateId } from "../../../../constants";

export function shouldChildContractsFor(factory: () => Promise<Contract>) {
  describe("childContractsFor", function () {
    it("should get array of child contracts by index", async function () {
      const [owner] = await ethers.getSigners();
      const erc721Instance = await factory();
      const erc721InstanceMock = await deployERC721("ERC721Simple");

      const supportsWhiteListChild = await erc721Instance.supportsInterface(InterfaceId.IERC998WL);
      if (supportsWhiteListChild) {
        await erc721Instance.whiteListChild(erc721InstanceMock.address, 0);
        await erc721Instance.whiteListChild(erc721Instance.address, 0);
      }

      await erc721InstanceMock.mintCommon(owner.address, templateId);
      await erc721Instance.mintCommon(owner.address, templateId); // this is edge case
      await erc721Instance.mintCommon(owner.address, templateId);

      const tx1 = erc721InstanceMock["safeTransferFrom(address,address,uint256,bytes)"](
        owner.address,
        erc721Instance.address,
        1, // erc721 tokenId
        "0x0000000000000000000000000000000000000000000000000000000000000001", // erc998 tokenId
      );
      await expect(tx1).to.not.be.reverted;

      if (supportsWhiteListChild) {
        const tx2 = await erc721Instance.getChildCount(erc721InstanceMock.address);
        expect(tx2).to.equal(1);
      }

      const tx3 = erc721Instance["safeTransferFrom(address,address,uint256,bytes)"](
        owner.address,
        erc721Instance.address,
        2, // erc721 tokenId
        "0x0000000000000000000000000000000000000000000000000000000000000001", // erc998 tokenId
      );
      await expect(tx3).to.not.be.reverted;

      if (supportsWhiteListChild) {
        const tx4 = await erc721Instance.getChildCount(erc721Instance.address);
        expect(tx4).to.equal(1);
      }

      const tx5 = await erc721Instance.childContractsFor(1);
      expect(tx5).deep.equal([erc721InstanceMock.address, erc721Instance.address]);
    });
  });
}
