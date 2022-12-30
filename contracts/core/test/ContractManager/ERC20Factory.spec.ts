import { expect } from "chai";
import { ethers } from "hardhat";
import { constants } from "ethers";

import { shouldBehaveLikeAccessControl } from "@gemunion/contracts-mocha";
import { amount, DEFAULT_ADMIN_ROLE, nonce, tokenName, tokenSymbol } from "@gemunion/contracts-constants";

import { cap, featureIds } from "../constants";
import { deployContractManager } from "./fixture";

describe("ERC20Factory", function () {
  const factory = () => deployContractManager(this.title);

  shouldBehaveLikeAccessControl(factory)(DEFAULT_ADMIN_ROLE);

  describe("deployERC20Token", function () {
    it("should deploy contract", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const network = await ethers.provider.getNetwork();
      const erc20 = await ethers.getContractFactory("ERC20Simple");

      const contractInstance = await factory();
      // "Erc20(bytes bytecode,string name,string symbol,uint256 cap,uint8[] featureIds,bytes32 nonce)";

      const c = {
        bytecode: erc20.bytecode,
        name: tokenName,
        symbol: tokenSymbol,
        cap,
        featureIds,
        nonce,
      };

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
          EIP712: [{ name: "c", type: "Erc20" }],
          Erc20: [
            { name: "bytecode", type: "bytes" },
            { name: "name", type: "string" },
            { name: "symbol", type: "string" },
            { name: "cap", type: "uint256" },
            { name: "featureIds", type: "uint8[]" },
            { name: "nonce", type: "bytes32" },
          ],
        },
        // Values
        { c },
      );
      const signer = owner.address;
      const bytecode = erc20.bytecode;
      const tx = await contractInstance.deployERC20Token(
        {
          signer,
          signature,
        },
        {
          bytecode,
          name: tokenName,
          symbol: tokenSymbol,
          cap,
          featureIds,
          nonce,
        },
      );

      const [address] = await contractInstance.allERC20Tokens();

      await expect(tx)
        .to.emit(contractInstance, "ERC20TokenDeployed")
        .withArgs(address, tokenName, tokenSymbol, cap, featureIds);

      const erc20Instance = erc20.attach(address);

      const hasRole1 = await erc20Instance.hasRole(DEFAULT_ADMIN_ROLE, contractInstance.address);
      expect(hasRole1).to.equal(false);

      const hasRole2 = await erc20Instance.hasRole(DEFAULT_ADMIN_ROLE, owner.address);
      expect(hasRole2).to.equal(true);

      const tx2 = erc20Instance.mint(receiver.address, amount);
      await expect(tx2).to.emit(erc20Instance, "Transfer").withArgs(constants.AddressZero, receiver.address, amount);

      const balance = await erc20Instance.balanceOf(receiver.address);
      expect(balance).to.equal(amount);
    });
  });
});
