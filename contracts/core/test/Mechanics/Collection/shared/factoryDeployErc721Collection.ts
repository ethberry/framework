import { ethers } from "hardhat";
import { expect } from "chai";

import { testChainId } from "@framework/constants";

import {
  baseTokenURI,
  batchSize,
  DEFAULT_ADMIN_ROLE,
  featureIds,
  nonce,
  royalty,
  tokenName,
  tokenSymbol,
} from "../../../constants";
import { blockAwait } from "../../../../scripts/utils/blockAwait";
import { ContractManager, ERC721Collection } from "../../../../typechain-types";

export async function factoryDeployErc721Collection(factoryInstance: ContractManager): Promise<ERC721Collection> {
  const network = await ethers.provider.getNetwork();
  const [owner] = await ethers.getSigners();
  const erc721 = await ethers.getContractFactory("ERC721Collection");

  const c = {
    bytecode: erc721.bytecode,
    name: tokenName,
    symbol: tokenSymbol,
    baseTokenURI,
    featureIds,
    royalty,
    batchSize,
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
      EIP712: [{ name: "c", type: "Collection" }],
      Collection: [
        { name: "bytecode", type: "bytes" },
        { name: "name", type: "string" },
        { name: "symbol", type: "string" },
        { name: "baseTokenURI", type: "string" },
        { name: "featureIds", type: "uint8[]" },
        { name: "royalty", type: "uint96" },
        { name: "batchSize", type: "uint96" },
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
  const tx = await factoryInstance.deployERC721Collection(
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
      batchSize,
      nonce,
    },
  );

  if (network.chainId === testChainId) {
    await blockAwait();
  }

  const [address] = await factoryInstance.allERC721Collections();

  await expect(tx)
    .to.emit(factoryInstance, "ERC721CollectionDeployed")
    .withArgs(address, tokenName, tokenSymbol, royalty, baseTokenURI, featureIds, batchSize, owner.address);

  const erc721Instance = erc721.attach(address);

  await expect(tx)
    .to.emit(erc721Instance, "ConsecutiveTransfer")
    .withArgs(0, batchSize - 1, ethers.constants.AddressZero, owner.address);

  const hasRole1 = await erc721Instance.hasRole(DEFAULT_ADMIN_ROLE, factoryInstance.address);
  expect(hasRole1).to.equal(false);

  const hasRole2 = await erc721Instance.hasRole(DEFAULT_ADMIN_ROLE, owner.address);
  expect(hasRole2).to.equal(true);

  return erc721Instance;
}
