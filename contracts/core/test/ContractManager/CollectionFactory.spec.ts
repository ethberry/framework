import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber, constants } from "ethers";

import {
  baseTokenURI,
  DEFAULT_ADMIN_ROLE,
  nonce,
  royalty,
  batchSize,
  tokenName,
  tokenSymbol,
} from "@gemunion/contracts-constants";

import { contractTemplate, templateId, tokenId } from "../constants";
import { deployContractManager } from "./fixture";

describe("CollectionFactory", function () {
  const factory = () => deployContractManager(this.title);

  describe("deployCollection", function () {
    it("should deploy contract", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const network = await ethers.provider.getNetwork();
      const erc721 = await ethers.getContractFactory("ERC721CollectionSimple");

      const contractInstance = await factory();

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
          EIP712: [
            { name: "params", type: "Params" },
            { name: "args", type: "CollectionArgs" },
          ],
          Params: [
            { name: "nonce", type: "bytes32" },
            { name: "bytecode", type: "bytes" },
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
            bytecode: erc721.bytecode,
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
          bytecode: erc721.bytecode,
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

      const [address] = await contractInstance.allCollections();

      await expect(tx)
        .to.emit(contractInstance, "CollectionDeployed")
        .withNamedArgs({
          addr: address,
          args: {
            name: tokenName,
            symbol: tokenSymbol,
            royalty: BigNumber.from(royalty),
            baseTokenURI,
            batchSize: BigNumber.from(batchSize),
            contractTemplate,
          },
          owner: owner.address,
        });

      const erc721Instance = erc721.attach(address);

      await expect(tx)
        .to.emit(erc721Instance, "ConsecutiveTransfer")
        .withArgs(0, batchSize - 1, constants.AddressZero, owner.address);

      const hasRole1 = await erc721Instance.hasRole(DEFAULT_ADMIN_ROLE, contractInstance.address);
      expect(hasRole1).to.equal(false);

      const hasRole2 = await erc721Instance.hasRole(DEFAULT_ADMIN_ROLE, owner.address);
      expect(hasRole2).to.equal(true);

      const tx2 = erc721Instance.mint(receiver.address, templateId);
      await expect(tx2).to.be.revertedWith("MethodNotSupported");

      const balance = await erc721Instance.balanceOf(owner.address);
      expect(balance).to.equal(batchSize);

      const uri = await erc721Instance.tokenURI(tokenId);
      expect(uri).to.equal(`${baseTokenURI}/${erc721Instance.address.toLowerCase()}/${tokenId}`);
    });
  });
});
