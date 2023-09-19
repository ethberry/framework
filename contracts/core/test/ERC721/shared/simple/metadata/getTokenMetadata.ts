import { expect } from "chai";
import { ethers } from "hardhat";

import { RARITY, TEMPLATE_ID } from "@gemunion/contracts-constants";
import type { IERC721EnumOptions } from "@gemunion/contracts-erc721e";

import { FrameworkInterfaceId, templateId } from "../../../../constants";
import { customMintCommonERC721 } from "../../customMintFn";

export function shouldGetTokenMetadata(factory: () => Promise<any>, options: IERC721EnumOptions = {}) {
  const { mint = customMintCommonERC721, tokenId: defaultTokenId = 0n } = options;

  describe("getTokenMetadata", function () {
    it("should get metadata", async function () {
      const [owner] = await ethers.getSigners();

      const contractInstance = await factory();

      await mint(contractInstance, owner, owner.address);

      const metadata = await contractInstance.getTokenMetadata(defaultTokenId);

      const isSupported = await contractInstance.supportsInterface(FrameworkInterfaceId.ERC721Random);
      if (isSupported) {
        expect(metadata.length).to.equal(2);
        expect(metadata[0].key).to.equal(TEMPLATE_ID);
        expect(metadata[0].value).to.equal(templateId);
        expect(metadata[1].key).to.equal(RARITY);
        expect(metadata[1].value).to.equal(0);
      } else {
        expect(metadata.length).to.equal(1);
        expect(metadata[0].key).to.equal(TEMPLATE_ID);
        expect(metadata[0].value).to.equal(templateId);
      }
    });

    it("should get metadata (empty)", async function () {
      const contractInstance = await factory();

      const metadata = await contractInstance.getTokenMetadata(defaultTokenId);

      expect(metadata.length).to.equal(0);
    });
  });
}
