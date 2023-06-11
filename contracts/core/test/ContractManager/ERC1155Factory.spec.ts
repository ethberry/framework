import { expect } from "chai";
import { ethers } from "hardhat";
import { ZeroAddress } from "ethers";

import { amount, baseTokenURI, DEFAULT_ADMIN_ROLE, nonce, royalty } from "@gemunion/contracts-constants";
import { deployContract } from "@gemunion/contracts-mocks";

import { contractTemplate, tokenId } from "../constants";

describe("ERC1155Factory", function () {
  const factory = () => deployContract(this.title);

  describe("deployERC1155Token", function () {
    it("should deploy contract", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const network = await ethers.provider.getNetwork();
      const erc1155Factory = await ethers.getContractFactory("ERC1155Simple");

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
            { name: "args", type: "Erc1155Args" },
          ],
          Params: [
            { name: "nonce", type: "bytes32" },
            { name: "bytecode", type: "bytes" },
          ],
          Erc1155Args: [
            { name: "royalty", type: "uint96" },
            { name: "baseTokenURI", type: "string" },
            { name: "contractTemplate", type: "string" },
          ],
        },
        // Values
        {
          params: {
            bytecode: erc1155Factory.bytecode,
            nonce,
          },
          args: {
            royalty,
            baseTokenURI,
            contractTemplate,
          },
        },
      );

      const tx = await contractInstance.deployERC1155Token(
        {
          bytecode: erc1155Factory.bytecode,
          nonce,
        },
        {
          royalty,
          baseTokenURI,
          contractTemplate,
        },
        signature,
      );

      const [address] = await contractInstance.allERC1155Tokens();

      await expect(tx)
        .to.emit(contractInstance, "ERC1155TokenDeployed")
        .withArgs(address, [royalty, baseTokenURI, contractTemplate]);

      const erc1155Instance = await ethers.getContractAt("ERC1155Simple", address);

      const hasRole1 = await erc1155Instance.hasRole(DEFAULT_ADMIN_ROLE, await contractInstance.getAddress());
      expect(hasRole1).to.equal(false);

      const hasRole2 = await erc1155Instance.hasRole(DEFAULT_ADMIN_ROLE, owner.address);
      expect(hasRole2).to.equal(true);

      const tx2 = erc1155Instance.mint(receiver.address, tokenId, amount, "0x");
      await expect(tx2)
        .to.emit(erc1155Instance, "TransferSingle")
        .withArgs(owner.address, ZeroAddress, receiver.address, tokenId, amount);

      const balance = await erc1155Instance.balanceOf(receiver.address, tokenId);
      expect(balance).to.equal(amount);

      const uri = await erc1155Instance.uri(0);
      expect(uri).to.equal(`${baseTokenURI}/${(await erc1155Instance.getAddress()).toLowerCase()}/{id}`);
    });

    it("should fail: SignerMissingRole", async function () {
      const [owner] = await ethers.getSigners();
      const network = await ethers.provider.getNetwork();
      const erc1155 = await ethers.getContractFactory("ERC1155Simple");

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
            { name: "args", type: "Erc1155Args" },
          ],
          Params: [
            { name: "nonce", type: "bytes32" },
            { name: "bytecode", type: "bytes" },
          ],
          Erc1155Args: [
            { name: "royalty", type: "uint96" },
            { name: "baseTokenURI", type: "string" },
            { name: "contractTemplate", type: "string" },
          ],
        },
        // Values
        {
          params: {
            bytecode: erc1155.bytecode,
            nonce,
          },
          args: {
            royalty,
            baseTokenURI,
            contractTemplate,
          },
        },
      );

      await contractInstance.renounceRole(DEFAULT_ADMIN_ROLE, owner.address);

      const tx = contractInstance.deployERC1155Token(
        {
          bytecode: erc1155.bytecode,
          nonce,
        },
        {
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
