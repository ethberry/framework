import { expect } from "chai";
import { ethers } from "hardhat";

import { shouldBehaveLikeAccessControl } from "@gemunion/contracts-mocha";
import { DEFAULT_ADMIN_ROLE, nonce, tokenName, tokenSymbol } from "@gemunion/contracts-constants";

import { baseTokenURI, featureIds, royalty, templateId, tokenId } from "../constants";

import { deployContractManager } from "./fixture";

describe("ERC721Factory", function () {
  const factory = () => deployContractManager(this.title);

  shouldBehaveLikeAccessControl(factory)(DEFAULT_ADMIN_ROLE);

  describe("deployERC721Token", function () {
    it("should deploy contract", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const network = await ethers.provider.getNetwork();
      const erc721 = await ethers.getContractFactory("ERC721Simple");

      const contractInstance = await factory();
      // "Erc721(bytes bytecode,string name,string symbol,string baseTokenURI,uint8[] featureIds,uint96 royalty,bytes32 nonce)";

      const c = {
        bytecode: erc721.bytecode,
        name: tokenName,
        symbol: tokenSymbol,
        baseTokenURI,
        featureIds,
        royalty,
        nonce,
      };

      const signature = await owner._signTypedData(
        // Domain
        {
          name: "ContractManager",
          version: "1.0.0",
          chainId: network.chainId,
          verifyingContract: contractInstance.address,
        },
        // Types
        {
          EIP712: [{ name: "c", type: "Erc721" }],
          Erc721: [
            { name: "bytecode", type: "bytes" },
            { name: "name", type: "string" },
            { name: "symbol", type: "string" },
            { name: "baseTokenURI", type: "string" },
            { name: "featureIds", type: "uint8[]" },
            { name: "royalty", type: "uint96" },
            { name: "nonce", type: "bytes32" },
          ],
        },
        // Values
        { c },
      );
      const signer = owner.address;
      const bytecode = erc721.bytecode;
      const tx = await contractInstance.deployERC721Token(
        {
          signer,
          signature,
        },
        {
          bytecode,
          name: tokenName,
          symbol: tokenSymbol,
          baseTokenURI,
          featureIds,
          royalty,
          nonce,
        },
      );

      const [address] = await contractInstance.allERC721Tokens();

      await expect(tx)
        .to.emit(contractInstance, "ERC721TokenDeployed")
        .withArgs(address, tokenName, tokenSymbol, royalty, baseTokenURI, featureIds);

      const erc721Instance = erc721.attach(address);

      const hasRole1 = await erc721Instance.hasRole(DEFAULT_ADMIN_ROLE, contractInstance.address);
      expect(hasRole1).to.equal(false);

      const hasRole2 = await erc721Instance.hasRole(DEFAULT_ADMIN_ROLE, owner.address);
      expect(hasRole2).to.equal(true);

      const tx2 = erc721Instance.mintCommon(receiver.address, templateId);
      await expect(tx2)
        .to.emit(erc721Instance, "Transfer")
        .withArgs(ethers.constants.AddressZero, receiver.address, tokenId);

      const balance = await erc721Instance.balanceOf(receiver.address);
      expect(balance).to.equal(1);

      const uri = await erc721Instance.tokenURI(tokenId);
      expect(uri).to.equal(`${baseTokenURI}/${erc721Instance.address.toLowerCase()}/${tokenId}`);
    });
  });
});
