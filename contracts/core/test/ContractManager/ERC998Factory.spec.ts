import { expect } from "chai";
import { ethers } from "hardhat";
import { ZeroAddress } from "ethers";

import {
  baseTokenURI,
  DEFAULT_ADMIN_ROLE,
  nonce,
  royalty,
  tokenName,
  tokenSymbol,
} from "@gemunion/contracts-constants";
import { deployContract } from "@gemunion/contracts-mocks";

import { contractTemplate, templateId, tokenId } from "../constants";

describe("ERC998Factory", function () {
  const factory = () => deployContract(this.title);

  describe("deployERC998Token", function () {
    it("should deploy contract", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const network = await ethers.provider.getNetwork();
      const erc998Factory = await ethers.getContractFactory("ERC998Simple");

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
            { name: "args", type: "Erc998Args" },
          ],
          Params: [
            { name: "nonce", type: "bytes32" },
            { name: "bytecode", type: "bytes" },
          ],
          Erc998Args: [
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
            bytecode: erc998Factory.bytecode,
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

      const tx = await contractInstance.deployERC998Token(
        {
          nonce,
          bytecode: erc998Factory.bytecode,
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

      const [address] = await contractInstance.allERC998Tokens();

      await expect(tx)
        .to.emit(contractInstance, "ERC998TokenDeployed")
        .withArgs(address, [tokenName, tokenSymbol, royalty, baseTokenURI, contractTemplate]);

      const erc998Instance = await ethers.getContractAt("ERC998Simple", address);

      const hasRole1 = await erc998Instance.hasRole(DEFAULT_ADMIN_ROLE, await contractInstance.getAddress());
      expect(hasRole1).to.equal(false);

      const hasRole2 = await erc998Instance.hasRole(DEFAULT_ADMIN_ROLE, owner.address);
      expect(hasRole2).to.equal(true);

      const tx2 = erc998Instance.mintCommon(receiver.address, templateId);
      await expect(tx2).to.emit(erc998Instance, "Transfer").withArgs(ZeroAddress, receiver.address, tokenId);

      const balance = await erc998Instance.balanceOf(receiver.address);
      expect(balance).to.equal(1);

      const uri = await erc998Instance.tokenURI(tokenId);
      expect(uri).to.equal(`${baseTokenURI}/${(await erc998Instance.getAddress()).toLowerCase()}/${tokenId}`);
    });

    it("should fail: SignerMissingRole", async function () {
      const [owner] = await ethers.getSigners();
      const network = await ethers.provider.getNetwork();
      const erc998 = await ethers.getContractFactory("ERC998Simple");

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
            { name: "args", type: "Erc998Args" },
          ],
          Params: [
            { name: "nonce", type: "bytes32" },
            { name: "bytecode", type: "bytes" },
          ],
          Erc998Args: [
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
            bytecode: erc998.bytecode,
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

      const tx = contractInstance.deployERC998Token(
        {
          nonce,
          bytecode: erc998.bytecode,
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
