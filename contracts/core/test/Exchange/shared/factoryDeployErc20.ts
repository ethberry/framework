import { ethers } from "hardhat";
import { encodeBytes32String } from "ethers";
import { expect } from "chai";

import { blockAwait } from "@gemunion/contracts-utils";
import { DEFAULT_ADMIN_ROLE, MINTER_ROLE, tokenName, tokenSymbol } from "@gemunion/contracts-constants";
import { testChainId } from "@framework/constants";

import { cap, contractTemplate } from "../../constants";
import { ContractManager, ERC20Simple, Exchange } from "../../../typechain-types";

export async function factoryDeployErc20(
  factoryInstance: ContractManager,
  exchangeInstance: Exchange,
): Promise<ERC20Simple> {
  const network = await ethers.provider.getNetwork();
  const [owner] = await ethers.getSigners();
  const erc20Factory = await ethers.getContractFactory("ERC20Simple");
  const nonce = encodeBytes32String("nonce1");

  const verifyingContract = await factoryInstance.getAddress();
  const exchangeAddress = await exchangeInstance.getAddress();

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
        { name: "args", type: "Erc20Args" },
      ],
      Params: [
        { name: "nonce", type: "bytes32" },
        { name: "bytecode", type: "bytes" },
      ],
      Erc20Args: [
        { name: "name", type: "string" },
        { name: "symbol", type: "string" },
        { name: "cap", type: "uint256" },
        { name: "contractTemplate", type: "string" },
      ],
    },
    // Values
    {
      params: {
        nonce,
        bytecode: erc20Factory.bytecode,
      },
      args: {
        name: tokenName,
        symbol: tokenSymbol,
        cap,
        contractTemplate,
      },
    },
  );

  const tx = await factoryInstance.deployERC20Token(
    {
      nonce,
      bytecode: erc20Factory.bytecode,
    },
    {
      name: tokenName,
      symbol: tokenSymbol,
      cap,
      contractTemplate,
    },
    signature,
  );

  if (network.chainId === testChainId) {
    await blockAwait();
  }

  const [address] = await factoryInstance.allERC20Tokens();

  await expect(tx)
    .to.emit(factoryInstance, "ERC20TokenDeployed")
    .withArgs(address, [tokenName, tokenSymbol, cap, contractTemplate]);

  const erc20Instance = await ethers.getContractAt("ERC20Simple", address);

  const hasRole1 = await erc20Instance.hasRole(DEFAULT_ADMIN_ROLE, verifyingContract);
  expect(hasRole1).to.equal(false);

  const hasRole2 = await erc20Instance.hasRole(DEFAULT_ADMIN_ROLE, owner.address);
  expect(hasRole2).to.equal(true);

  const hasRole3 = await erc20Instance.hasRole(MINTER_ROLE, exchangeAddress);
  expect(hasRole3).to.equal(true);

  return erc20Instance;
}
