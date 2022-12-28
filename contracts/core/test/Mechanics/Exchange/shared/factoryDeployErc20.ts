import { ethers } from "hardhat";
import { utils } from "ethers";
import { expect } from "chai";

import { testChainId } from "@framework/constants";

import { cap, DEFAULT_ADMIN_ROLE, featureIds, MINTER_ROLE, tokenName, tokenSymbol } from "../../../constants";
import { blockAwait } from "../../../../scripts/utils/blockAwait";
import { ContractManager, ERC20Simple, Exchange } from "../../../../typechain-types";

export async function factoryDeployErc20(
  factoryInstance: ContractManager,
  exchangeInstance: Exchange,
): Promise<ERC20Simple> {
  const network = await ethers.provider.getNetwork();
  const [owner] = await ethers.getSigners();
  const erc20 = await ethers.getContractFactory("ERC20Simple");
  const nonce = utils.formatBytes32String("nonce1");
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
      verifyingContract: factoryInstance.address,
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

  if (network.chainId === testChainId) {
    await blockAwait();
  }
  const signer = owner.address;
  const bytecode = erc20.bytecode;
  const tx = await factoryInstance.deployERC20Token(
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

  if (network.chainId === testChainId) {
    await blockAwait();
  }

  const [address] = await factoryInstance.allERC20Tokens();

  await expect(tx)
    .to.emit(factoryInstance, "ERC20TokenDeployed")
    .withArgs(address, tokenName, tokenSymbol, cap, featureIds);

  const erc20Instance = erc20.attach(address);

  const hasRole1 = await erc20Instance.hasRole(DEFAULT_ADMIN_ROLE, factoryInstance.address);
  expect(hasRole1).to.equal(false);

  const hasRole2 = await erc20Instance.hasRole(DEFAULT_ADMIN_ROLE, owner.address);
  expect(hasRole2).to.equal(true);

  const hasRole3 = await erc20Instance.hasRole(MINTER_ROLE, exchangeInstance.address);
  expect(hasRole3).to.equal(true);

  return erc20Instance;
}
