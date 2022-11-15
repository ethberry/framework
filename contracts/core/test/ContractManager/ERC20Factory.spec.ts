import { expect, use } from "chai";
import { solidity } from "ethereum-waffle";
import { ethers } from "hardhat";
import { ContractFactory } from "ethers";
import { Network } from "@ethersproject/networks";

import { ERC20Factory } from "../../typechain-types";
import { amount, DEFAULT_ADMIN_ROLE, featureIds, nonce, PAUSER_ROLE, tokenName, tokenSymbol } from "../constants";

import { shouldHaveRole } from "../shared/accessible/hasRoles";
import { shouldGetRoleAdmin } from "../shared/accessible/getRoleAdmin";
import { shouldGrantRole } from "../shared/accessible/grantRole";
import { shouldRevokeRole } from "../shared/accessible/revokeRole";
import { shouldRenounceRole } from "../shared/accessible/renounceRole";

use(solidity);

describe("ERC20Factory", function () {
  let erc20: ContractFactory;
  let factory: ContractFactory;
  let factoryInstance: ERC20Factory;
  let network: Network;

  beforeEach(async function () {
    erc20 = await ethers.getContractFactory("ERC20Simple");
    factory = await ethers.getContractFactory("ERC20Factory");
    [this.owner, this.receiver, this.stranger] = await ethers.getSigners();

    factoryInstance = (await factory.deploy()) as ERC20Factory;

    network = await ethers.provider.getNetwork();

    this.contractInstance = factoryInstance;
  });

  shouldHaveRole(DEFAULT_ADMIN_ROLE);
  shouldGetRoleAdmin(DEFAULT_ADMIN_ROLE, PAUSER_ROLE);
  shouldGrantRole();
  shouldRevokeRole();
  shouldRenounceRole();

  describe("deployERC20Token", function () {
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
            { name: "cap", type: "uint256" },
            { name: "featureIds", type: "uint8[]" },
          ],
        },
        // Value
        {
          nonce,
          bytecode: erc20.bytecode,
          name: tokenName,
          symbol: tokenSymbol,
          cap: amount,
          featureIds,
        },
      );

      const tx = await factoryInstance.deployERC20Token(
        nonce,
        erc20.bytecode,
        tokenName,
        tokenSymbol,
        amount,
        featureIds,
        this.owner.address,
        signature,
      );

      const [address] = await factoryInstance.allERC20Tokens();

      await expect(tx)
        .to.emit(factoryInstance, "ERC20TokenDeployed")
        .withArgs(address, tokenName, tokenSymbol, amount, featureIds);

      const erc20Instance = erc20.attach(address);

      const hasRole1 = await erc20Instance.hasRole(DEFAULT_ADMIN_ROLE, factoryInstance.address);
      expect(hasRole1).to.equal(false);

      const hasRole2 = await erc20Instance.hasRole(DEFAULT_ADMIN_ROLE, this.owner.address);
      expect(hasRole2).to.equal(true);

      const tx2 = erc20Instance.mint(this.receiver.address, amount);
      await expect(tx2)
        .to.emit(erc20Instance, "Transfer")
        .withArgs(ethers.constants.AddressZero, this.receiver.address, amount);

      const balance = await erc20Instance.balanceOf(this.receiver.address);
      expect(balance).to.equal(amount);
    });
  });
});
