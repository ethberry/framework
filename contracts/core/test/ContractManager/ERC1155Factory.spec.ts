import { expect } from "chai";
import { ethers } from "hardhat";
import { constants, BigNumber } from "ethers";

import { amount, baseTokenURI, DEFAULT_ADMIN_ROLE, nonce, royalty } from "@gemunion/contracts-constants";

import { featureIds, tokenId } from "../constants";

import { deployContractManager } from "./fixture";

describe("ERC1155Factory", function () {
  const factory = () => deployContractManager(this.title);

  describe("deployERC1155Token", function () {
    it("should deploy contract", async function () {
      const [owner, receiver] = await ethers.getSigners();
      const network = await ethers.provider.getNetwork();
      const erc1155 = await ethers.getContractFactory("ERC1155Simple");

      const contractInstance = await factory();

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
          EIP712: [
            { name: "params", type: "Params" },
            { name: "args", type: "Erc1155Args" },
          ],
          Params: [
            { name: "nonce", type: "bytes32" },
            { name: "bytecode", type: "bytes" },
          ],
          Erc1155Args: [
            { name: "royalty", type: "uint96" },
            { name: "baseTokenURI", type: "string" },
            { name: "featureIds", type: "uint8[]" },
          ],
        },
        // Values
        {
          params: {
            bytecode: erc1155.bytecode,
            nonce,
          },
          args: {
            royalty,
            baseTokenURI,
            featureIds,
          },
        },
      );

      const tx = await contractInstance.deployERC1155Token(
        {
          bytecode: erc1155.bytecode,
          nonce,
        },
        {
          royalty,
          baseTokenURI,
          featureIds,
        },
        signature,
      );

      const [address] = await contractInstance.allERC1155Tokens();

      // await expect(tx)
      //   .to.emit(contractInstance, "ERC1155TokenDeployed")
      //   .withArgs(address, royalty, baseTokenURI, featureIds);

      await expect(tx)
        .to.emit(contractInstance, "ERC1155TokenDeployed")
        .withNamedArgs({
          addr: address,
          args: {
            royalty: BigNumber.from(royalty),
            baseTokenURI,
            featureIds,
          },
        });

      const erc1155Instance = erc1155.attach(address);

      const hasRole1 = await erc1155Instance.hasRole(DEFAULT_ADMIN_ROLE, contractInstance.address);
      expect(hasRole1).to.equal(false);

      const hasRole2 = await erc1155Instance.hasRole(DEFAULT_ADMIN_ROLE, owner.address);
      expect(hasRole2).to.equal(true);

      const tx2 = erc1155Instance.mint(receiver.address, tokenId, amount, "0x");
      await expect(tx2)
        .to.emit(erc1155Instance, "TransferSingle")
        .withArgs(owner.address, constants.AddressZero, receiver.address, tokenId, amount);

      const balance = await erc1155Instance.balanceOf(receiver.address, tokenId);
      expect(balance).to.equal(amount);

      const uri = await erc1155Instance.uri(0);
      expect(uri).to.equal(`${baseTokenURI}/${erc1155Instance.address.toLowerCase()}/{id}`);
    });
  });
});
