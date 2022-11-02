import { expect, use } from "chai";
import { solidity } from "ethereum-waffle";
import { ethers } from "hardhat";
import { ContractFactory } from "ethers";
import { Network } from "@ethersproject/networks";

import { ERC721Factory } from "../../typechain-types";
import {
  baseTokenURI,
  DEFAULT_ADMIN_ROLE,
  featureIds,
  nonce,
  PAUSER_ROLE,
  royalty,
  templateId,
  tokenId,
  tokenName,
  tokenSymbol,
} from "../constants";

import { shouldHaveRole } from "../shared/accessible/hasRoles";
import { shouldGetRoleAdmin } from "../shared/accessible/getRoleAdmin";
import { shouldGrantRole } from "../shared/accessible/grantRole";
import { shouldRevokeRole } from "../shared/accessible/revokeRole";
import { shouldRenounceRole } from "../shared/accessible/renounceRole";

use(solidity);

describe("ERC721Factory", function () {
  let erc721: ContractFactory;
  let factory: ContractFactory;
  let factoryInstance: ERC721Factory;
  let network: Network;

  beforeEach(async function () {
    erc721 = await ethers.getContractFactory("ERC721Simple");
    factory = await ethers.getContractFactory("ERC721Factory");
    [this.owner, this.receiver, this.stranger] = await ethers.getSigners();

    factoryInstance = (await factory.deploy()) as ERC721Factory;

    network = await ethers.provider.getNetwork();

    this.contractInstance = factoryInstance;
  });

  shouldHaveRole(DEFAULT_ADMIN_ROLE);
  shouldGetRoleAdmin(DEFAULT_ADMIN_ROLE, PAUSER_ROLE);
  shouldGrantRole();
  shouldRevokeRole();
  shouldRenounceRole();

  describe("deployERC721Token", function () {
    it("should deploy contract", async function () {
      const signature = await this.owner._signTypedData(
        // Domain
        {
          name: "ContractManager",
          version: "1.0.0",
          chainId: network.chainId,
          verifyingContract: factoryInstance.address,
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
          bytecode: erc721.bytecode,
          name: tokenName,
          symbol: tokenSymbol,
          royalty,
          baseTokenURI,
          featureIds,
        },
      );

      const tx = await factoryInstance.deployERC721Token(
        nonce,
        erc721.bytecode,
        tokenName,
        tokenSymbol,
        royalty,
        baseTokenURI,
        featureIds,
        this.owner.address,
        signature,
      );

      const [address] = await factoryInstance.allERC721Tokens();

      await expect(tx)
        .to.emit(factoryInstance, "ERC721TokenDeployed")
        .withArgs(address, tokenName, tokenSymbol, royalty, baseTokenURI, featureIds);

      const erc721Instance = erc721.attach(address);

      const hasRole1 = await erc721Instance.hasRole(DEFAULT_ADMIN_ROLE, factoryInstance.address);
      expect(hasRole1).to.equal(false);

      const hasRole2 = await erc721Instance.hasRole(DEFAULT_ADMIN_ROLE, this.owner.address);
      expect(hasRole2).to.equal(true);

      const tx2 = erc721Instance.mintCommon(this.receiver.address, templateId);
      await expect(tx2)
        .to.emit(erc721Instance, "Transfer")
        .withArgs(ethers.constants.AddressZero, this.receiver.address, tokenId);

      const balance = await erc721Instance.balanceOf(this.receiver.address);
      expect(balance).to.equal(1);

      const uri = await erc721Instance.tokenURI(tokenId);
      expect(uri).to.equal(`${baseTokenURI}/${erc721Instance.address.toLowerCase()}/${tokenId}`);
    });
  });
});
