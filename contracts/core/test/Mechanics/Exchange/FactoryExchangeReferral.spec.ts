import { expect, use } from "chai";
import { solidity } from "ethereum-waffle";
import { ethers } from "hardhat";
import { ContractFactory } from "ethers";
import { Network } from "@ethersproject/networks";

import { ContractManager, Exchange } from "../../../typechain-types";
import {
  baseTokenURI,
  DEFAULT_ADMIN_ROLE,
  nonce,
  royalty,
  featureIds,
  tokenName,
  tokenSymbol,
  MINTER_ROLE, amountWei, amountWeiEth, tokenZero, tokenId, templateId
} from "../../constants";
import { wrapOneToManySignature } from "./shared/utils";
import { blockAwait } from "../../../scripts/utils/blockAwait";

use(solidity);

describe.only("Factory Exchange Referral", function () {
  let erc721: ContractFactory;
  let factory: ContractFactory;
  let factoryInstance: ContractManager;
  let exchangeInstance: Exchange;
  let network: Network;
  let generateSignature: (values: Record<string, any>) => Promise<string>;

  beforeEach(async function () {
    [this.owner, this.receiver, this.stranger] = await ethers.getSigners();
    network = await ethers.provider.getNetwork();

    factory = await ethers.getContractFactory("ContractManager");
    factoryInstance = (await factory.deploy()) as ContractManager;
    await factoryInstance.deployed();

    const exchangeFactory = await ethers.getContractFactory("Exchange");
    exchangeInstance = await exchangeFactory.deploy(tokenName);
    if (network.chainId === 1337) await blockAwait();
    generateSignature = wrapOneToManySignature(network, exchangeInstance, this.owner);

    const minters = [exchangeInstance.address];
    const metadata = [exchangeInstance.address];
    await factoryInstance.setFactories(
      // minters
      minters,
      // metadata editors
      metadata,
    );

    erc721 = await ethers.getContractFactory("ERC721Simple");
    this.contractInstance = factoryInstance;
  });

  describe("Deploy, Purchase, Referral", function () {
    it("should deploy ERC721 and Purchase at Exchange (one ref)", async function () {
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
      if (network.chainId === 1337) await blockAwait();
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
      if (network.chainId === 1337) await blockAwait();

      const [address] = await factoryInstance.allERC721Tokens();

      await expect(tx)
        .to.emit(factoryInstance, "ERC721TokenDeployed")
        .withArgs(address, tokenName, tokenSymbol, royalty, baseTokenURI, featureIds);

      const erc721Instance = erc721.attach(address);

      const hasRole1 = await erc721Instance.hasRole(DEFAULT_ADMIN_ROLE, factoryInstance.address);
      expect(hasRole1).to.equal(false);

      const hasRole2 = await erc721Instance.hasRole(DEFAULT_ADMIN_ROLE, this.owner.address);
      expect(hasRole2).to.equal(true);

      const hasRole3 = await erc721Instance.hasRole(MINTER_ROLE, exchangeInstance.address);
      expect(hasRole3).to.equal(true);

      const signature1 = await generateSignature({
        account: this.owner.address,
        params: {
          nonce,
          externalId: templateId,
          expiresAt: 0, // never
          referrer: this.owner.address,
        },
        item: {
          tokenType: 2,
          token: erc721Instance.address,
          tokenId: templateId,
          amount: 1,
        },
        price: [
          {
            amount: amountWei,
            token: tokenZero,
            tokenId: "0",
            tokenType: 0,
          },
        ],
      });

      const tx1 = exchangeInstance.connect(this.owner).purchase(
        {
          nonce,
          externalId: templateId,
          expiresAt: 0,
          referrer: this.owner.address,
        },
        {
          // ERC721
          tokenType: 2,
          token: erc721Instance.address,
          tokenId: templateId,
          amount: 1,
        },
        [
          // ETH
          {
            amount: amountWei,
            token: tokenZero,
            tokenId: "0",
            tokenType: 0,
          },
        ],
        this.owner.address,
        signature1,
        { value: amountWeiEth },
      );
      await expect(tx1).to.emit(exchangeInstance, "Purchase");
      if (network.chainId === 1337) await blockAwait();
      await expect(tx1).to.emit(erc721Instance, "Transfer");
      await expect(tx1).to.emit(exchangeInstance, "ReferralReward");

      const eventFilter = exchangeInstance.filters.ReferralReward();
      const events = await exchangeInstance.queryFilter(eventFilter);
      expect(events.length).to.equal(1);

      const balance = await erc721Instance.balanceOf(this.owner.address);
      expect(balance).to.equal(1);
    });
    // TODO add multi-ref test
  });
});
