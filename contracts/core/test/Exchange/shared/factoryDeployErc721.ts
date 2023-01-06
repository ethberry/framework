import { ethers } from "hardhat";
import { expect } from "chai";
import { BigNumber } from "ethers";

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

import { featureIds } from "../../constants";
import { ContractManager, ERC721Simple, Exchange } from "../../../typechain-types";

export async function factoryDeployErc721(
  factoryInstance: ContractManager,
  exchangeInstance: Exchange,
): Promise<ERC721Simple> {
  const network = await ethers.provider.getNetwork();
  const [owner] = await ethers.getSigners();
  const erc721 = await ethers.getContractFactory("ERC721Simple");

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
      EIP712: [
        { name: "params", type: "Params" },
        { name: "args", type: "Erc721Args" },
      ],
      Params: [
        { name: "nonce", type: "bytes32" },
        { name: "bytecode", type: "bytes" },
      ],
      Erc721Args: [
        { name: "name", type: "string" },
        { name: "symbol", type: "string" },
        { name: "royalty", type: "uint96" },
        { name: "baseTokenURI", type: "string" },
        { name: "featureIds", type: "uint8[]" },
      ],
    },
    // Values
    {
      params: {
        nonce,
        bytecode: erc721.bytecode,
      },
      args: {
        name: tokenName,
        symbol: tokenSymbol,
        royalty,
        baseTokenURI,
        featureIds,
      },
    },
  );

  const tx = await factoryInstance.deployERC721Token(
    {
      nonce,
      bytecode: erc721.bytecode,
    },
    {
      name: tokenName,
      symbol: tokenSymbol,
      royalty,
      baseTokenURI,
      featureIds,
    },
    signature,
  );

  if (network.chainId === testChainId) {
    await blockAwait();
  }

  const [address] = await factoryInstance.allERC721Tokens();

  await expect(tx)
    .to.emit(factoryInstance, "ERC721TokenDeployed")
    .withNamedArgs({
      addr: address,
      args: {
        name: tokenName,
        symbol: tokenSymbol,
        royalty: BigNumber.from(royalty),
        baseTokenURI,
        featureIds,
      },
    });

  const erc721Instance = erc721.attach(address);

  const hasRole1 = await erc721Instance.hasRole(DEFAULT_ADMIN_ROLE, factoryInstance.address);
  expect(hasRole1).to.equal(false);

  const hasRole2 = await erc721Instance.hasRole(DEFAULT_ADMIN_ROLE, owner.address);
  expect(hasRole2).to.equal(true);

  const hasRole3 = await erc721Instance.hasRole(MINTER_ROLE, exchangeInstance.address);
  expect(hasRole3).to.equal(true);

  return erc721Instance;
}
