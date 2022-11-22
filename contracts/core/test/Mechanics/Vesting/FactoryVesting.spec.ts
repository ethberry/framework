import { use } from "chai";
import { solidity } from "ethereum-waffle";
import { ethers } from "hardhat";
import { ContractFactory } from "ethers";
import { Network } from "@ethersproject/networks";

import { ContractManager } from "../../../typechain-types";
import { blockAwait } from "../../../scripts/utils/blockAwait";
import { factoryDeployVesting } from "./shared/factoryDeployVesting";

use(solidity);

describe.only("Factory Vesting", function () {
  let factory: ContractFactory;
  let factoryInstance: ContractManager;
  let network: Network;

  beforeEach(async function () {
    [this.owner, this.receiver, this.stranger] = await ethers.getSigners();
    network = await ethers.provider.getNetwork();

    factory = await ethers.getContractFactory("ContractManager");
    factoryInstance = (await factory.deploy()) as ContractManager;
    await factoryInstance.deployed();

    if (network.chainId === 13378) {
      await blockAwait();
    }

    this.contractInstance = factoryInstance;
  });

  describe("Deploy Vesting via CM", function () {
    it("should deploy", async function () {
      // VESTING FACTORY DEPLOY
      await factoryDeployVesting(factoryInstance);
    });
  });
});
