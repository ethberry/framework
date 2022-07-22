import { expect } from "chai";
import { ethers } from "hardhat";
import { Network } from "@ethersproject/networks";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { ERC1155Simple, ERC20Simple, ERC721Simple, Exchange, ERC721Lootbox } from "../../../typechain-types";
import {
  amount,
  baseTokenURI,
  DEFAULT_ADMIN_ROLE,
  MINTER_ROLE,
  nonce,
  PAUSER_ROLE,
  royalty,
  tokenId,
  tokenName,
  tokenSymbol,
} from "../../constants";
import { shouldHaveRole } from "../../shared/AccessControl/hasRoles";

const externalId = 123;
const expiresAt = 0;

const params = {
  externalId,
  expiresAt,
};

describe("ExchangeCore", function () {
  let exchangeInstance: Exchange;
  let erc20Instance: ERC20Simple;
  let erc721Instance: ERC721Simple;
  let erc1155Instance: ERC1155Simple;
  let lootboxInstance: ERC721Lootbox;
  let network: Network;

  beforeEach(async function () {
    [this.owner, this.receiver] = await ethers.getSigners();

    const exchangeFactory = await ethers.getContractFactory("Exchange");
    exchangeInstance = await exchangeFactory.deploy(tokenName);

    const erc20Factory = await ethers.getContractFactory("ERC20Simple");
    erc20Instance = await erc20Factory.deploy(tokenName, tokenSymbol, amount);
    await erc20Instance.grantRole(MINTER_ROLE, exchangeInstance.address);

    const erc721Factory = await ethers.getContractFactory("ERC721Simple");
    erc721Instance = await erc721Factory.deploy(tokenName, tokenSymbol, royalty, baseTokenURI);
    await erc721Instance.grantRole(MINTER_ROLE, exchangeInstance.address);

    const erc1155Factory = await ethers.getContractFactory("ERC1155Simple");
    erc1155Instance = await erc1155Factory.deploy(royalty, baseTokenURI);
    await erc1155Instance.grantRole(MINTER_ROLE, exchangeInstance.address);

    const lootboxFactory = await ethers.getContractFactory("ERC721Lootbox");
    lootboxInstance = await lootboxFactory.deploy(tokenName, tokenSymbol, royalty, baseTokenURI);
    await lootboxInstance.grantRole(MINTER_ROLE, exchangeInstance.address);

    network = await ethers.provider.getNetwork();

    this.contractInstance = exchangeInstance;
  });

  const generateSignature = (account: SignerWithAddress, values: Record<string, any>) => {
    return account._signTypedData(
      // Domain
      {
        name: tokenName,
        version: "1.0.0",
        chainId: network.chainId,
        verifyingContract: exchangeInstance.address,
      },
      // Types
      {
        EIP712: [
          { name: "nonce", type: "bytes32" },
          { name: "account", type: "address" },
          { name: "params", type: "Params" },
          { name: "item", type: "Asset" },
          { name: "ingredients", type: "Asset[]" },
        ],
        Params: [
          { name: "externalId", type: "uint256" },
          { name: "expiresAt", type: "uint256" },
        ],
        Asset: [
          { name: "tokenType", type: "uint256" },
          { name: "token", type: "address" },
          { name: "tokenId", type: "uint256" },
          { name: "amount", type: "uint256" },
        ],
      },
      // Value
      values,
    );
  };

  shouldHaveRole(DEFAULT_ADMIN_ROLE, PAUSER_ROLE);

  describe("purchase", function () {
    describe("ERROR", function () {
      it("should fail: duplicate mint", async function () {
        const signature = await generateSignature(this.owner, {
          nonce,
          account: this.receiver.address,
          params,
          item: {
            tokenType: 2,
            token: erc721Instance.address,
            tokenId,
            amount,
          },
          ingredients: [
            {
              tokenType: 1,
              token: erc20Instance.address,
              tokenId,
              amount,
            },
          ],
        });

        await erc20Instance.mint(this.receiver.address, amount);
        await erc20Instance.connect(this.receiver).approve(exchangeInstance.address, amount);

        const tx1 = exchangeInstance.connect(this.receiver).purchase(
          nonce,
          params,
          {
            tokenType: 2,
            token: erc721Instance.address,
            tokenId,
            amount,
          },
          [
            {
              tokenType: 1,
              token: erc20Instance.address,
              tokenId,
              amount,
            },
          ],
          this.owner.address,
          signature,
        );

        await expect(tx1).to.emit(exchangeInstance, "Purchase");

        const tx2 = exchangeInstance.connect(this.receiver).purchase(
          nonce,
          params,
          {
            tokenType: 2,
            token: erc721Instance.address,
            tokenId,
            amount,
          },
          [
            {
              tokenType: 1,
              token: erc20Instance.address,
              tokenId,
              amount,
            },
          ],
          this.owner.address,
          signature,
        );
        await expect(tx2).to.be.revertedWith("Exchange: Expired signature");
      });

      it("should fail for wrong signer role", async function () {
        const signature = await generateSignature(this.owner, {
          nonce,
          account: this.receiver.address,
          params,
          item: {
            tokenType: 2,
            token: erc721Instance.address,
            tokenId,
            amount,
          },
          ingredients: [
            {
              tokenType: 1,
              token: erc20Instance.address,
              tokenId,
              amount,
            },
          ],
        });

        const tx1 = exchangeInstance.connect(this.receiver).purchase(
          nonce,
          params,
          {
            tokenType: 2,
            token: erc721Instance.address,
            tokenId,
            amount,
          },
          [
            {
              tokenType: 1,
              token: erc20Instance.address,
              tokenId,
              amount,
            },
          ],
          this.receiver.address,
          signature,
        );

        await expect(tx1).to.be.revertedWith(`Exchange: Wrong signer`);
      });

      it("should fail for wrong signature", async function () {
        const tx = exchangeInstance.purchase(
          nonce,
          params,
          {
            tokenType: 2,
            token: erc721Instance.address,
            tokenId,
            amount,
          },
          [
            {
              tokenType: 1,
              token: erc20Instance.address,
              tokenId,
              amount,
            },
          ],
          this.owner.address,
          ethers.utils.formatBytes32String("signature"),
        );

        await expect(tx).to.be.revertedWith(`Exchange: Invalid signature`);
      });
    });
  });
});
