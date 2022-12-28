import { ethers } from "hardhat";
import { expect } from "chai";

import { testChainId } from "@framework/constants";

import {
  baseTokenURI,
  DEFAULT_ADMIN_ROLE,
  featureIds,
  MINTER_ROLE,
  nonce,
  royalty,
  tokenName,
  tokenSymbol,
} from "../../../constants";
import { blockAwait } from "../../../../scripts/utils/blockAwait";
import { ContractManager, ERC721Simple, Exchange } from "../../../../typechain-types";

export async function factoryDeployErc721(
  factoryInstance: ContractManager,
  exchangeInstance: Exchange,
): Promise<ERC721Simple> {
  const network = await ethers.provider.getNetwork();
  const [owner] = await ethers.getSigners();
  const erc721 = await ethers.getContractFactory("ERC721Simple");
  // "Erc721(bytes bytecode,string name,string symbol,string baseTokenURI,uint8[] featureIds,uint96 royalty,bytes32 nonce)";
  const c = {
    bytecode: erc721.bytecode,
    name: tokenName,
    symbol: tokenSymbol,
    baseTokenURI,
    featureIds,
    royalty,
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
      EIP712: [{ name: "c", type: "Erc721" }],
      Erc721: [
        { name: "bytecode", type: "bytes" },
        { name: "name", type: "string" },
        { name: "symbol", type: "string" },
        { name: "baseTokenURI", type: "string" },
        { name: "featureIds", type: "uint8[]" },
        { name: "royalty", type: "uint96" },
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
  const bytecode = erc721.bytecode;
  const tx = await factoryInstance.deployERC721Token(
    {
      signer,
      signature,
    },
    {
      bytecode,
      name: tokenName,
      symbol: tokenSymbol,
      baseTokenURI,
      featureIds,
      royalty,
      nonce,
    },
  );

  if (network.chainId === testChainId) {
    await blockAwait();
  }

  const [address] = await factoryInstance.allERC721Tokens();

  await expect(tx)
    .to.emit(factoryInstance, "ERC721TokenDeployed")
    .withArgs(address, tokenName, tokenSymbol, royalty, baseTokenURI, featureIds);

  const erc721Instance = erc721.attach(address);

  const hasRole1 = await erc721Instance.hasRole(DEFAULT_ADMIN_ROLE, factoryInstance.address);
  expect(hasRole1).to.equal(false);

  const hasRole2 = await erc721Instance.hasRole(DEFAULT_ADMIN_ROLE, owner.address);
  expect(hasRole2).to.equal(true);

  const hasRole3 = await erc721Instance.hasRole(MINTER_ROLE, exchangeInstance.address);
  expect(hasRole3).to.equal(true);

  return erc721Instance;
}
