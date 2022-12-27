import { expect } from "chai";
import { ethers } from "hardhat";

import { shouldBehaveLikeAccessControl } from "@gemunion/contracts-mocha";
import {
  baseTokenURI,
  DEFAULT_ADMIN_ROLE,
  nonce,
  royalty,
  tokenName,
  tokenSymbol,
} from "@gemunion/contracts-constants";

import { featureIds, templateId, tokenId } from "../constants";
import { deployContractManager } from "./fixture";

describe("ERC998Factory", function () {
  const factory = () => deployContractManager(this.title);

  shouldBehaveLikeAccessControl(factory)(DEFAULT_ADMIN_ROLE);

  describe("deployERC998Token", function () {
    it("should deploy contract", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const network = await ethers.provider.getNetwork();
      const erc998 = await ethers.getContractFactory("ERC998Simple");

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
            { name: "nonce", type: "bytes32" },
            { name: "bytecode", type: "bytes" },
            { name: "name", type: "string" },
            { name: "symbol", type: "string" },
            { name: "royalty", type: "uint96" },
            { name: "baseTokenURI", type: "string" },
            { name: "featureIds", type: "uint8[]" },
          ],
        },
        // Value
        {
          nonce,
          bytecode: erc998.bytecode,
          name: tokenName,
          symbol: tokenSymbol,
          royalty,
          baseTokenURI,
          featureIds,
        },
      );

      const tx = await contractInstance.deployERC998Token(
        nonce,
        erc998.bytecode,
        tokenName,
        tokenSymbol,
        royalty,
        baseTokenURI,
        featureIds,
        owner.address,
        signature,
      );

      const [address] = await contractInstance.allERC998Tokens();

      await expect(tx)
        .to.emit(contractInstance, "ERC998TokenDeployed")
        .withArgs(address, tokenName, tokenSymbol, royalty, baseTokenURI, featureIds);

      const erc998Instance = erc998.attach(address);

      const hasRole1 = await erc998Instance.hasRole(DEFAULT_ADMIN_ROLE, contractInstance.address);
      expect(hasRole1).to.equal(false);

      const hasRole2 = await erc998Instance.hasRole(DEFAULT_ADMIN_ROLE, owner.address);
      expect(hasRole2).to.equal(true);

      const tx2 = erc998Instance.mintCommon(receiver.address, templateId);
      await expect(tx2)
        .to.emit(erc998Instance, "Transfer")
        .withArgs(ethers.constants.AddressZero, receiver.address, tokenId);

      const balance = await erc998Instance.balanceOf(receiver.address);
      expect(balance).to.equal(1);

      const uri = await erc998Instance.tokenURI(tokenId);
      expect(uri).to.equal(`${baseTokenURI}/${erc998Instance.address.toLowerCase()}/${tokenId}`);
    });
  });
});
