import { use } from "chai";
import { solidity } from "ethereum-waffle";
import { ethers } from "hardhat";
import { ContractFactory } from "ethers";
import { Network } from "@ethersproject/networks";

import { testChainId } from "@framework/constants";

import { ContractManager } from "../../../typechain-types";
import { blockAwait } from "../../../scripts/utils/blockAwait";
import { factoryDeployErc721Collection } from "./shared/factoryDeployErc721Collection";

use(solidity);

describe.only("Factory Deploy Collection", function () {
  let factory: ContractFactory;
  let factoryInstance: ContractManager;
  let network: Network;

  beforeEach(async function () {
    [this.owner, this.receiver, this.stranger] = await ethers.getSigners();
    network = await ethers.provider.getNetwork();

    factory = await ethers.getContractFactory("ContractManager");
    factoryInstance = (await factory.deploy()) as ContractManager;
    await factoryInstance.deployed();

    if (network.chainId === testChainId) {
      await blockAwait();
    }

    this.contractInstance = factoryInstance;
  });

  describe.only("Deploy collection", function () {
    it("Deploy ERC721 collection with 1000 batch", async function () {
      // FACTORY DEPLOY
      await factoryDeployErc721Collection(factoryInstance);
    });
  });
});
