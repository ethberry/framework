import { ethers } from "hardhat";
import { expect } from "chai";

import { blockAwait } from "@gemunion/contracts-utils";
import {
  baseTokenURI,
  DEFAULT_ADMIN_ROLE,
  MINTER_ROLE,
  nonce,
  royalty,
  tokenName,
  tokenSymbol,
} from "@gemunion/contracts-constants";
import { testChainId } from "@framework/constants";

import { contractTemplate, externalId } from "../../constants";
import { ContractManager, ERC721Simple, Exchange } from "../../../typechain-types";

export async function factoryDeployErc721(
  factoryInstance: ContractManager,
  exchangeInstance: Exchange,
): Promise<ERC721Simple> {
  const network = await ethers.provider.getNetwork();
  const [owner] = await ethers.getSigners();
  const { bytecode } = await ethers.getContractFactory("ERC721Simple");

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
        { name: "args", type: "Erc721Args" },
      ],
      Params: [
        { name: "nonce", type: "bytes32" },
        { name: "bytecode", type: "bytes" },
        { name: "externalId", type: "uint256" },
      ],
      Erc721Args: [
        { name: "name", type: "string" },
        { name: "symbol", type: "string" },
        { name: "royalty", type: "uint96" },
        { name: "baseTokenURI", type: "string" },
        { name: "contractTemplate", type: "string" },
      ],
    },
    // Values
    {
      params: {
        nonce,
        bytecode,
        externalId,
      },
      args: {
        name: tokenName,
        symbol: tokenSymbol,
        royalty,
        baseTokenURI,
        contractTemplate,
      },
    },
  );

  const tx = await factoryInstance.deployERC721Token(
    {
      nonce,
      bytecode,
      externalId,
    },
    {
      name: tokenName,
      symbol: tokenSymbol,
      royalty,
      baseTokenURI,
      contractTemplate,
    },
    signature,
  );

  if (network.chainId === testChainId) {
    await blockAwait();
  }

  const [address] = await factoryInstance.allERC721Tokens();

  await expect(tx)
    .to.emit(factoryInstance, "ERC721TokenDeployed")
    .withArgs(address, externalId, [tokenName, tokenSymbol, royalty, baseTokenURI, contractTemplate]);

  const erc721Instance = await ethers.getContractAt("ERC721Simple", address);

  const hasRole1 = await erc721Instance.hasRole(DEFAULT_ADMIN_ROLE, verifyingContract);
  expect(hasRole1).to.equal(false);

  const hasRole2 = await erc721Instance.hasRole(DEFAULT_ADMIN_ROLE, owner.address);
  expect(hasRole2).to.equal(true);

  const hasRole3 = await erc721Instance.hasRole(MINTER_ROLE, exchangeAddress);
  expect(hasRole3).to.equal(true);

  return erc721Instance;
}
