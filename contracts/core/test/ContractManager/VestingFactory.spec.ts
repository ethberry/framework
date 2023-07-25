import { expect } from "chai";
import { ethers } from "hardhat";
import { concat, getAddress, toBeHex, ZeroAddress, zeroPadValue } from "ethers";
import { time } from "@openzeppelin/test-helpers";

import { amount, DEFAULT_ADMIN_ROLE, nonce } from "@gemunion/contracts-constants";
import { deployContract } from "@gemunion/contracts-mocks";

import { buildBytecode, buildCreate2Address, isEqualEventArgArrObj, isEqualEventArgObj } from "../utils";
import { claimId, externalId, tokenId, userId } from "../constants";
import { deployERC20 } from "../ERC20/shared/fixtures";
import { decodeTraits } from "@framework/traits-api";

describe("VestingFactory", function () {
  const factory = () => deployContract(this.title);

  describe("deployVesting", function () {
    it("should deploy contract", async function () {
      const [owner] = await ethers.getSigners();
      const network = await ethers.provider.getNetwork();
      const { bytecode } = await ethers.getContractFactory("Vesting");

      const contractInstance = await factory();
      const verifyingContract = await contractInstance.getAddress();

      const erc20Instance = await deployERC20();
      await erc20Instance.mint(owner.address, amount);
      await erc20Instance.approve(await contractInstance.getAddress(), amount);

      const current = await time.latest();

      const encodedExternalId = concat([zeroPadValue(toBeHex(userId), 3), zeroPadValue(toBeHex(claimId), 4)]);

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
            { name: "args", type: "VestingArgs" },
            { name: "items", type: "Asset[]" },
          ],
          Params: [
            { name: "nonce", type: "bytes32" },
            { name: "bytecode", type: "bytes" },
            { name: "externalId", type: "uint256" },
          ],
          VestingArgs: [
            { name: "beneficiary", type: "address" },
            { name: "startTimestamp", type: "uint64" },
            { name: "cliffInMonth", type: "uint16" },
            { name: "monthlyRelease", type: "uint16" },
          ],
          Asset: [
            { name: "tokenType", type: "uint256" },
            { name: "token", type: "address" },
            { name: "tokenId", type: "uint256" },
            { name: "amount", type: "uint256" },
          ],
        },
        // Values
        {
          params: {
            nonce,
            bytecode,
            externalId: encodedExternalId,
          },
          args: {
            beneficiary: owner.address,
            startTimestamp: current.toNumber(),
            cliffInMonth: 12,
            monthlyRelease: 417,
          },
          items: [
            {
              tokenType: 1,
              token: await erc20Instance.getAddress(),
              tokenId,
              amount,
            },
          ],
        },
      );

      const tx = await contractInstance.deployVesting(
        {
          nonce,
          bytecode,
          externalId: encodedExternalId,
        },
        {
          beneficiary: owner.address,
          startTimestamp: current.toNumber(),
          cliffInMonth: 12,
          monthlyRelease: 417,
        },
        [
          {
            tokenType: 1,
            token: await erc20Instance.getAddress(),
            tokenId,
            amount,
          },
        ],
        signature,
      );

      const buildByteCode = buildBytecode(
        ["address", "uint256", "uint256", "uint256"],
        [owner.address, current.toNumber(), 12, 417],
        bytecode,
      );
      const address = getAddress(buildCreate2Address(await contractInstance.getAddress(), nonce, buildByteCode));

      await expect(tx)
        .to.emit(contractInstance, "VestingDeployed")
        .withArgs(
          address,
          encodedExternalId,
          isEqualEventArgObj({
            beneficiary: owner.address,
            startTimestamp: current.toString(),
            cliffInMonth: "12",
            monthlyRelease: "417",
          }),
          isEqualEventArgArrObj({
            tokenType: "1",
            token: await erc20Instance.getAddress(),
            tokenId,
            amount,
          }),
        );

      const decoded = decodeTraits(BigInt(encodedExternalId), ["user", "claim"]);
      expect(decoded.claim).to.equal(claimId);
      expect(decoded.user).to.equal(userId);

      await expect(tx).changeTokenBalances(erc20Instance, [owner, address], [-amount, amount]);
    });

    it("should fail: SignerMissingRole", async function () {
      const [owner] = await ethers.getSigners();
      const network = await ethers.provider.getNetwork();
      const { bytecode } = await ethers.getContractFactory("Vesting");

      const contractInstance = await factory();
      const verifyingContract = await contractInstance.getAddress();

      const erc20Instance = await deployERC20();
      await erc20Instance.mint(owner.address, amount);
      await erc20Instance.approve(await contractInstance.getAddress(), amount);

      const current = await time.latest();
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
            { name: "args", type: "VestingArgs" },
            { name: "items", type: "Asset[]" },
          ],
          Params: [
            { name: "nonce", type: "bytes32" },
            { name: "bytecode", type: "bytes" },
            { name: "externalId", type: "uint256" },
          ],
          VestingArgs: [
            { name: "beneficiary", type: "address" },
            { name: "startTimestamp", type: "uint64" },
            { name: "cliffInMonth", type: "uint16" },
            { name: "monthlyRelease", type: "uint16" },
          ],
          Asset: [
            { name: "tokenType", type: "uint256" },
            { name: "token", type: "address" },
            { name: "tokenId", type: "uint256" },
            { name: "amount", type: "uint256" },
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
            beneficiary: owner.address,
            startTimestamp: current.toNumber(),
            cliffInMonth: 12,
            monthlyRelease: 417,
          },
          items: [
            {
              tokenType: 1,
              token: await erc20Instance.getAddress(),
              tokenId,
              amount,
            },
          ],
        },
      );

      await contractInstance.renounceRole(DEFAULT_ADMIN_ROLE, owner.address);

      const tx = contractInstance.deployVesting(
        {
          nonce,
          bytecode,
          externalId,
        },
        {
          beneficiary: owner.address,
          startTimestamp: current.toNumber(),
          cliffInMonth: 12,
          monthlyRelease: 417,
        },
        [
          {
            tokenType: 1,
            token: await erc20Instance.getAddress(),
            tokenId,
            amount,
          },
        ],
        signature,
      );

      await expect(tx).to.be.revertedWithCustomError(contractInstance, "SignerMissingRole");
    });

    it("should fail: UnsupportedTokenType", async function () {
      const [owner] = await ethers.getSigners();
      const network = await ethers.provider.getNetwork();
      const { bytecode } = await ethers.getContractFactory("Vesting");

      const contractInstance = await factory();
      const verifyingContract = await contractInstance.getAddress();

      const current = await time.latest();
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
            { name: "args", type: "VestingArgs" },
            { name: "items", type: "Asset[]" },
          ],
          Params: [
            { name: "nonce", type: "bytes32" },
            { name: "bytecode", type: "bytes" },
            { name: "externalId", type: "uint256" },
          ],
          VestingArgs: [
            { name: "beneficiary", type: "address" },
            { name: "startTimestamp", type: "uint64" },
            { name: "cliffInMonth", type: "uint16" },
            { name: "monthlyRelease", type: "uint16" },
          ],
          Asset: [
            { name: "tokenType", type: "uint256" },
            { name: "token", type: "address" },
            { name: "tokenId", type: "uint256" },
            { name: "amount", type: "uint256" },
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
            beneficiary: owner.address,
            startTimestamp: current.toNumber(),
            cliffInMonth: 12,
            monthlyRelease: 417,
          },
          items: [
            {
              tokenType: 0,
              token: ZeroAddress,
              tokenId,
              amount,
            },
          ],
        },
      );

      const tx = contractInstance.deployVesting(
        {
          nonce,
          bytecode,
          externalId,
        },
        {
          beneficiary: owner.address,
          startTimestamp: current.toNumber(),
          cliffInMonth: 12,
          monthlyRelease: 417,
        },
        [
          {
            tokenType: 0,
            token: ZeroAddress,
            tokenId,
            amount,
          },
        ],
        signature,
      );

      await expect(tx).to.be.revertedWithCustomError(contractInstance, "UnsupportedTokenType");
    });
  });
});
