import { expect } from "chai";
import { ethers } from "hardhat";
import { ZeroAddress, getAddress } from "ethers";

import {
  baseTokenURI,
  batchSize,
  DEFAULT_ADMIN_ROLE,
  nonce,
  royalty,
  tokenName,
  tokenSymbol,
} from "@gemunion/contracts-constants";
import { deployContract } from "@gemunion/contracts-mocks";

import { contractTemplate, externalId, templateId, tokenId } from "../constants";
import { buildBytecode, buildCreate2Address } from "../utils";

describe("CollectionFactory", function () {
  const factory = () => deployContract(this.title);

  describe("deployCollection", function () {
    it("should deploy contract", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const network = await ethers.provider.getNetwork();
      const { bytecode } = await ethers.getContractFactory("ERC721CSimple");

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
            { name: "args", type: "CollectionArgs" },
          ],
          Params: [
            { name: "nonce", type: "bytes32" },
            { name: "bytecode", type: "bytes" },
            { name: "externalId", type: "uint256" },
          ],
          CollectionArgs: [
            { name: "name", type: "string" },
            { name: "symbol", type: "string" },
            { name: "royalty", type: "uint96" },
            { name: "baseTokenURI", type: "string" },
            { name: "batchSize", type: "uint96" },
            { name: "contractTemplate", type: "string" },
          ],
        },
        // Values
        {
          params: {
            nonce,
            bytecode,
            externalId,
          },
          args: {
            name: tokenName,
            symbol: tokenSymbol,
            royalty,
            baseTokenURI,
            batchSize,
            contractTemplate,
          },
        },
      );

      const tx = await contractInstance.deployCollection(
        {
          nonce,
          bytecode,
          externalId,
        },
        {
          name: tokenName,
          symbol: tokenSymbol,
          royalty,
          baseTokenURI,
          contractTemplate,
          batchSize,
        },
        signature,
      );

      const buildByteCode = buildBytecode(
        ["string", "string", "uint256", "string", "uint256", "address"],
        [tokenName, tokenSymbol, royalty, baseTokenURI, batchSize, owner.address],
        bytecode,
      );
      const address = getAddress(buildCreate2Address(await contractInstance.getAddress(), nonce, buildByteCode));
      await expect(tx)
        .to.emit(contractInstance, "CollectionDeployed")
        .withArgs(address, externalId, [tokenName, tokenSymbol, royalty, baseTokenURI, batchSize, contractTemplate]);

      const erc721Instance = await ethers.getContractAt("ERC721CSimple", address);

      await expect(tx)
        .to.emit(erc721Instance, "ConsecutiveTransfer")
        .withArgs(0, batchSize - 1n, ZeroAddress, owner.address);

      const hasRole1 = await erc721Instance.hasRole(DEFAULT_ADMIN_ROLE, await contractInstance.getAddress());
      expect(hasRole1).to.equal(false);

      const hasRole2 = await erc721Instance.hasRole(DEFAULT_ADMIN_ROLE, owner.address);
      expect(hasRole2).to.equal(true);

      const tx2 = erc721Instance.mint(receiver.address, templateId);
      await expect(tx2).to.be.revertedWithCustomError(erc721Instance, "MethodNotSupported");

      const balance = await erc721Instance.balanceOf(owner.address);
      expect(balance).to.equal(batchSize);

      const uri = await erc721Instance.tokenURI(tokenId);
      expect(uri).to.equal(`${baseTokenURI}/${(await erc721Instance.getAddress()).toLowerCase()}/${tokenId}`);
    });

    it("should fail: SignerMissingRole", async function () {
      const [owner] = await ethers.getSigners();
      const network = await ethers.provider.getNetwork();
      const { bytecode } = await ethers.getContractFactory("ERC721CSimple");

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
            { name: "args", type: "CollectionArgs" },
          ],
          Params: [
            { name: "nonce", type: "bytes32" },
            { name: "bytecode", type: "bytes" },
            { name: "externalId", type: "uint256" },
          ],
          CollectionArgs: [
            { name: "name", type: "string" },
            { name: "symbol", type: "string" },
            { name: "royalty", type: "uint96" },
            { name: "baseTokenURI", type: "string" },
            { name: "batchSize", type: "uint96" },
            { name: "contractTemplate", type: "string" },
          ],
        },
        // Values
        {
          params: {
            nonce,
            bytecode,
            externalId,
          },
          args: {
            name: tokenName,
            symbol: tokenSymbol,
            royalty,
            baseTokenURI,
            batchSize,
            contractTemplate,
          },
        },
      );

      await contractInstance.renounceRole(DEFAULT_ADMIN_ROLE, owner.address);

      const tx = contractInstance.deployCollection(
        {
          nonce,
          bytecode,
          externalId,
        },
        {
          name: tokenName,
          symbol: tokenSymbol,
          royalty,
          baseTokenURI,
          contractTemplate,
          batchSize,
        },
        signature,
      );

      await expect(tx).to.be.revertedWithCustomError(contractInstance, "SignerMissingRole");
    });
  });
});
