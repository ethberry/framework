import { expect } from "chai";
import { ethers } from "hardhat";
import { ZeroAddress } from "ethers";

import {
  amount,
  baseTokenURI,
  DEFAULT_ADMIN_ROLE,
  nonce,
  royalty,
  tokenName,
  tokenSymbol,
} from "@gemunion/contracts-constants";
import { deployContract } from "@gemunion/contracts-mocks";

import { contractTemplate, templateId, tokenId } from "../constants";

describe("MysteryboxFactory", function () {
  const factory = () => deployContract(this.title);

  describe("deployMysteryToken", function () {
    it("should deploy contract", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const network = await ethers.provider.getNetwork();
      const erc721Factory = await ethers.getContractFactory("ERC721MysteryboxSimple");

      const contractInstance = await factory();
      const verifyingContract = await contractInstance.getAddress();

      const signature = await owner.signTypedData(
        // Domain
        {
          name: "ContractManager",
          version: "1.0.0",
          chainId: network.chainId,
          verifyingContract,
        },
        // Types
        {
          EIP712: [
            { name: "params", type: "Params" },
            { name: "args", type: "MysteryArgs" },
          ],
          Params: [
            { name: "nonce", type: "bytes32" },
            { name: "bytecode", type: "bytes" },
          ],
          MysteryArgs: [
            { name: "name", type: "string" },
            { name: "symbol", type: "string" },
            { name: "royalty", type: "uint96" },
            { name: "baseTokenURI", type: "string" },
            { name: "contractTemplate", type: "string" },
          ],
        },
        // Values
        {
          params: {
            nonce,
            bytecode: erc721Factory.bytecode,
          },
          args: {
            name: tokenName,
            symbol: tokenSymbol,
            royalty,
            baseTokenURI,
            contractTemplate,
          },
        },
      );

      const tx = await contractInstance.deployMysterybox(
        {
          nonce,
          bytecode: erc721Factory.bytecode,
        },
        {
          name: tokenName,
          symbol: tokenSymbol,
          royalty,
          baseTokenURI,
          contractTemplate,
        },
        signature,
      );

      const [address] = await contractInstance.allMysteryboxes();

      await expect(tx)
        .to.emit(contractInstance, "MysteryboxDeployed")
        .withArgs(address, [tokenName, tokenSymbol, royalty, baseTokenURI, contractTemplate]);

      const erc721Instance = await ethers.getContractAt("ERC721MysteryboxSimple", address);

      const hasRole1 = await erc721Instance.hasRole(DEFAULT_ADMIN_ROLE, await contractInstance.getAddress());
      expect(hasRole1).to.equal(false);

      const hasRole2 = await erc721Instance.hasRole(DEFAULT_ADMIN_ROLE, owner.address);
      expect(hasRole2).to.equal(true);

      const tx2 = erc721Instance.mintCommon(receiver.address, templateId);
      await expect(tx2).to.be.revertedWithCustomError(erc721Instance, "MethodNotSupported");

      const tx3 = erc721Instance.mintBox(receiver.address, templateId, [
        {
          tokenType: 2,
          token: await erc721Instance.getAddress(),
          tokenId,
          amount,
        },
      ]);
      await expect(tx3).to.emit(erc721Instance, "Transfer").withArgs(ZeroAddress, receiver.address, tokenId);

      const balance = await erc721Instance.balanceOf(receiver.address);
      expect(balance).to.equal(1);

      const uri = await erc721Instance.tokenURI(tokenId);
      expect(uri).to.equal(`${baseTokenURI}/${(await erc721Instance.getAddress()).toLowerCase()}/${tokenId}`);
    });

    it("should fail: SignerMissingRole", async function () {
      const [owner] = await ethers.getSigners();
      const network = await ethers.provider.getNetwork();
      const erc721 = await ethers.getContractFactory("ERC721MysteryboxSimple");

      const contractInstance = await factory();
      const verifyingContract = await contractInstance.getAddress();

      const signature = await owner.signTypedData(
        // Domain
        {
          name: "ContractManager",
          version: "1.0.0",
          chainId: network.chainId,
          verifyingContract,
        },
        // Types
        {
          EIP712: [
            { name: "params", type: "Params" },
            { name: "args", type: "MysteryArgs" },
          ],
          Params: [
            { name: "nonce", type: "bytes32" },
            { name: "bytecode", type: "bytes" },
          ],
          MysteryArgs: [
            { name: "name", type: "string" },
            { name: "symbol", type: "string" },
            { name: "royalty", type: "uint96" },
            { name: "baseTokenURI", type: "string" },
            { name: "contractTemplate", type: "string" },
          ],
        },
        // Values
        {
          params: {
            nonce,
            bytecode: erc721.bytecode,
          },
          args: {
            name: tokenName,
            symbol: tokenSymbol,
            royalty,
            baseTokenURI,
            contractTemplate,
          },
        },
      );

      await contractInstance.renounceRole(DEFAULT_ADMIN_ROLE, owner.address);

      const tx = contractInstance.deployMysterybox(
        {
          nonce,
          bytecode: erc721.bytecode,
        },
        {
          name: tokenName,
          symbol: tokenSymbol,
          royalty,
          baseTokenURI,
          contractTemplate,
        },
        signature,
      );

      await expect(tx).to.be.revertedWithCustomError(contractInstance, "SignerMissingRole");
    });
  });
});
