import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { utils, Wallet } from "ethers";

import { ETHERS_SIGNER } from "@gemunion/nestjs-ethers";
import type { IServerSignature } from "@gemunion/types-collection";
import {
  Erc1155ContractFeatures,
  Erc20ContractFeatures,
  Erc721ContractFeatures,
  Erc998ContractFeatures,
  IErc1155ContractDeployDto,
  IErc20TokenDeployDto,
  IErc721ContractDeployDto,
  IErc998ContractDeployDto,
  IMysteryboxContractDeployDto,
  IVestingDeployDto,
  MysteryboxContractFeatures,
  VestingContractTemplate,
} from "@framework/types";

import ERC20SimpleSol from "@framework/core-contracts/artifacts/contracts/ERC20/ERC20Simple.sol/ERC20Simple.json";
import ERC20BlacklistSol from "@framework/core-contracts/artifacts/contracts/ERC20/ERC20Blacklist.sol/ERC20Blacklist.json";
import LinearVestingSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Vesting/LinearVesting.sol/LinearVesting.json";
import GradedVestingSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Vesting/GradedVesting.sol/GradedVesting.json";
import CliffVestingSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Vesting/CliffVesting.sol/CliffVesting.json";

import ERC721BlackListSol from "@framework/core-contracts/artifacts/contracts/ERC721/ERC721Blacklist.sol/ERC721Blacklist.json";
import ERC721FullSol from "@framework/core-contracts/artifacts/contracts/ERC721/ERC721Full.sol/ERC721Full.json";
import ERC721RandomSol from "@framework/core-contracts/artifacts/contracts/ERC721/ERC721Random.sol/ERC721Random.json";
import ERC721RandomBlacklistSol from "@framework/core-contracts/artifacts/contracts/ERC721/ERC721RandomBlacklist.sol/ERC721RandomBlacklist.json";
import ERC721SimpleSol from "@framework/core-contracts/artifacts/contracts/ERC721/ERC721Simple.sol/ERC721Simple.json";
import ERC721SoulboundSol from "@framework/core-contracts/artifacts/contracts/ERC721/ERC721Soulbound.sol/ERC721Soulbound.json";
import ERC721UpgradeableSol from "@framework/core-contracts/artifacts/contracts/ERC721/ERC721Upgradeable.sol/ERC721Upgradeable.json";
import ERC721UpgradeableBlacklistSol from "@framework/core-contracts/artifacts/contracts/ERC721/ERC721UpgradeableBlacklist.sol/ERC721UpgradeableBlacklist.json";
import ERC721UpgradeableRandomSol from "@framework/core-contracts/artifacts/contracts/ERC721/ERC721UpgradeableRandom.sol/ERC721UpgradeableRandom.json";

import ERC998SimpleSol from "@framework/core-contracts/artifacts/contracts/ERC998/ERC998Simple.sol/ERC998Simple.json";
import ERC998BlackListSol from "@framework/core-contracts/artifacts/contracts/ERC998/ERC998Blacklist.sol/ERC998Blacklist.json";
import ERC998UpgradeableSol from "@framework/core-contracts/artifacts/contracts/ERC998/ERC998Upgradeable.sol/ERC998Upgradeable.json";
import ERC998UpgradeableRandomSol from "@framework/core-contracts/artifacts/contracts/ERC998/ERC998UpgradeableRandom.sol/ERC998UpgradeableRandom.json";
import ERC998FullSol from "@framework/core-contracts/artifacts/contracts/ERC998/ERC998Full.sol/ERC998Full.json";

import ERC1155SimpleSol from "@framework/core-contracts/artifacts/contracts/ERC1155/ERC1155Simple.sol/ERC1155Simple.json";
import ERC1155BlackListSol from "@framework/core-contracts/artifacts/contracts/ERC1155/ERC1155Blacklist.sol/ERC1155Blacklist.json";

import MysteryboxSimpleSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Mysterybox/ERC721MysteryboxSimple.sol/ERC721MysteryboxSimple.json";
import MysteryboxBlacklistSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Mysterybox/ERC721MysteryboxBlacklist.sol/ERC721MysteryboxBlacklist.json";
import MysteryboxPausableSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Mysterybox/ERC721MysteryboxPausable.sol/ERC721MysteryboxPausable.json";
import MysteryboxFullSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Mysterybox/ERC721MysteryboxFull.sol/ERC721MysteryboxFull.json";
import { UserEntity } from "../../user/user.entity";

@Injectable()
export class ContractManagerSignService {
  constructor(
    @Inject(ETHERS_SIGNER)
    private readonly signer: Wallet,
    private readonly configService: ConfigService,
  ) {}

  public async erc20Token(dto: IErc20TokenDeployDto, userEntity: UserEntity): Promise<IServerSignature> {
    const { contractFeatures, name, symbol, cap } = dto;

    const nonce = utils.randomBytes(32);
    const bytecode = this.getBytecodeByErc20ContractFeatures(contractFeatures);
    const signature = await this.signer._signTypedData(
      // Domain
      {
        name: "ContractManager",
        version: "1.0.0",
        chainId: userEntity.chainId,
        verifyingContract: this.configService.get<string>("CONTRACT_MANAGER_ADDR", ""),
      },
      // Types
      {
        EIP712: [
          { name: "nonce", type: "bytes32" },
          { name: "bytecode", type: "bytes" },
          { name: "name", type: "string" },
          { name: "symbol", type: "string" },
          { name: "cap", type: "uint256" },
          { name: "featureIds", type: "uint8[]" },
        ],
      },
      // Value
      {
        nonce,
        bytecode,
        name,
        symbol,
        cap,
        featureIds: contractFeatures.map(feature => Object.keys(Erc20ContractFeatures).indexOf(feature)),
      },
    );

    return { nonce: utils.hexlify(nonce), signature, expiresAt: 0, bytecode };
  }

  public async erc721Token(dto: IErc721ContractDeployDto, userEntity: UserEntity): Promise<IServerSignature> {
    const { contractFeatures, name, symbol, royalty, baseTokenURI } = dto;

    const nonce = utils.randomBytes(32);
    const bytecode = this.getBytecodeByErc721ContractFeatures(contractFeatures);
    const signature = await this.signer._signTypedData(
      // Domain
      {
        name: "ContractManager",
        version: "1.0.0",
        chainId: userEntity.chainId,
        verifyingContract: this.configService.get<string>("CONTRACT_MANAGER_ADDR", ""),
      },
      // Types
      {
        EIP712: [
          { name: "nonce", type: "bytes32" },
          { name: "bytecode", type: "bytes" },
          { name: "name", type: "string" },
          { name: "symbol", type: "string" },
          { name: "royalty", type: "uint96" },
          { name: "baseTokenURI", type: "string" },
          { name: "featureIds", type: "uint8[]" },
        ],
      },
      // Value
      {
        nonce,
        bytecode,
        name,
        symbol,
        baseTokenURI,
        royalty,
        featureIds: contractFeatures.map(feature => Object.keys(Erc721ContractFeatures).indexOf(feature)),
      },
    );
    return { nonce: utils.hexlify(nonce), signature, expiresAt: 0, bytecode };
  }

  public async erc998Token(dto: IErc998ContractDeployDto, userEntity: UserEntity): Promise<IServerSignature> {
    const { contractFeatures, name, symbol, royalty, baseTokenURI } = dto;

    const nonce = utils.randomBytes(32);
    const bytecode = this.getBytecodeByErc998ContractFeatures(contractFeatures);
    const signature = await this.signer._signTypedData(
      // Domain
      {
        name: "ContractManager",
        version: "1.0.0",
        chainId: userEntity.chainId,
        verifyingContract: this.configService.get<string>("CONTRACT_MANAGER_ADDR", ""),
      },
      // Types
      {
        EIP712: [
          { name: "nonce", type: "bytes32" },
          { name: "bytecode", type: "bytes" },
          { name: "name", type: "string" },
          { name: "symbol", type: "string" },
          { name: "royalty", type: "uint96" },
          { name: "baseTokenURI", type: "string" },
          { name: "featureIds", type: "uint8[]" },
        ],
      },
      // Value
      {
        nonce,
        bytecode,
        name,
        symbol,
        baseTokenURI,
        royalty,
        featureIds: contractFeatures.map(feature => Object.keys(Erc998ContractFeatures).indexOf(feature)),
      },
    );

    return { nonce: utils.hexlify(nonce), signature, expiresAt: 0, bytecode };
  }

  public async erc1155Token(dto: IErc1155ContractDeployDto, userEntity: UserEntity): Promise<IServerSignature> {
    const { contractFeatures, royalty, baseTokenURI } = dto;

    const nonce = utils.randomBytes(32);
    const bytecode = this.getBytecodeByErc1155ContractFeatures(contractFeatures);
    const signature = await this.signer._signTypedData(
      // Domain
      {
        name: "ContractManager",
        version: "1.0.0",
        chainId: userEntity.chainId,
        verifyingContract: this.configService.get<string>("CONTRACT_MANAGER_ADDR", ""),
      },
      // Types
      {
        EIP712: [
          { name: "nonce", type: "bytes32" },
          { name: "bytecode", type: "bytes" },
          { name: "royalty", type: "uint96" },
          { name: "baseTokenURI", type: "string" },
          { name: "featureIds", type: "uint8[]" },
        ],
      },
      // Value
      {
        nonce,
        bytecode,
        royalty,
        baseTokenURI,
        featureIds: contractFeatures.map(feature => Object.keys(Erc1155ContractFeatures).indexOf(feature)),
      },
    );

    return { nonce: utils.hexlify(nonce), signature, expiresAt: 0, bytecode };
  }

  // MODULE:MYSTERYBOX
  public async mysterybox(dto: IMysteryboxContractDeployDto, userEntity: UserEntity): Promise<IServerSignature> {
    const { contractFeatures, name, symbol, royalty, baseTokenURI } = dto;
    const nonce = utils.randomBytes(32);
    const bytecode = this.getBytecodeByMysteryboxContractFeatures(contractFeatures);
    const signature = await this.signer._signTypedData(
      // Domain
      {
        name: "ContractManager",
        version: "1.0.0",
        chainId: userEntity.chainId,
        verifyingContract: this.configService.get<string>("CONTRACT_MANAGER_ADDR", ""),
      },
      // Types
      {
        EIP712: [
          { name: "nonce", type: "bytes32" },
          { name: "bytecode", type: "bytes" },
          { name: "name", type: "string" },
          { name: "symbol", type: "string" },
          { name: "royalty", type: "uint96" },
          { name: "baseTokenURI", type: "string" },
          { name: "featureIds", type: "uint8[]" },
        ],
      },
      // Value
      {
        nonce,
        bytecode,
        name,
        symbol,
        baseTokenURI,
        royalty,
        featureIds: contractFeatures.map(feature => Object.keys(MysteryboxContractFeatures).indexOf(feature)),
      },
    );

    return { nonce: utils.hexlify(nonce), signature, expiresAt: 0, bytecode };
  }

  // MODULE:VESTING
  public async vesting(dto: IVestingDeployDto, userEntity: UserEntity): Promise<IServerSignature> {
    const { contractTemplate, account, startTimestamp, duration } = dto;

    const nonce = utils.randomBytes(32);
    const bytecode = this.getBytecodeByVestingContractTemplate(contractTemplate);
    const signature = await this.signer._signTypedData(
      // Domain
      {
        name: "ContractManager",
        version: "1.0.0",
        chainId: userEntity.chainId,
        verifyingContract: this.configService.get<string>("CONTRACT_MANAGER_ADDR", ""),
      },
      // Types
      {
        EIP712: [
          { name: "nonce", type: "bytes32" },
          { name: "bytecode", type: "bytes" },
          { name: "account", type: "address" },
          { name: "startTimestamp", type: "uint64" },
          { name: "duration", type: "uint64" },
          { name: "templateId", type: "uint256" },
        ],
      },
      // Value
      {
        nonce,
        bytecode,
        account,
        startTimestamp: Math.ceil(new Date(startTimestamp).getTime() / 1000), // in seconds
        duration: duration * 60 * 60 * 24, // in seconds
        templateId: Object.keys(VestingContractTemplate).indexOf(contractTemplate),
      },
    );

    return { nonce: utils.hexlify(nonce), signature, expiresAt: 0, bytecode };
  }

  public getBytecodeByErc20ContractFeatures(contractFeatures: Array<Erc20ContractFeatures>) {
    if (!contractFeatures.length) {
      return ERC20SimpleSol.bytecode;
    }

    if (contractFeatures.includes(Erc20ContractFeatures.BLACKLIST)) {
      return ERC20BlacklistSol.bytecode;
    }

    throw new BadRequestException("unsupportedCombination");
  }

  public getBytecodeByVestingContractTemplate(contractTemplate: VestingContractTemplate) {
    switch (contractTemplate) {
      case VestingContractTemplate.LINEAR:
        return LinearVestingSol.bytecode;
      case VestingContractTemplate.GRADED:
        return GradedVestingSol.bytecode;
      case VestingContractTemplate.CLIFF:
        return CliffVestingSol.bytecode;
      default:
        throw new Error("Unknown template");
    }
  }

  public getBytecodeByErc721ContractFeatures(contractFeatures: Array<Erc721ContractFeatures>) {
    if (!contractFeatures.length) {
      return ERC721SimpleSol.bytecode;
    }

    if (contractFeatures.length === 3) {
      return ERC721FullSol.bytecode;
    } else if (contractFeatures.length === 2) {
      if (
        contractFeatures.includes(Erc721ContractFeatures.UPGRADEABLE) &&
        contractFeatures.includes(Erc721ContractFeatures.RANDOM)
      ) {
        return ERC721UpgradeableRandomSol.bytecode;
      }

      if (
        contractFeatures.includes(Erc721ContractFeatures.UPGRADEABLE) &&
        contractFeatures.includes(Erc721ContractFeatures.BLACKLIST)
      ) {
        return ERC721UpgradeableBlacklistSol.bytecode;
      }

      if (
        contractFeatures.includes(Erc721ContractFeatures.RANDOM) &&
        contractFeatures.includes(Erc721ContractFeatures.BLACKLIST)
      ) {
        return ERC721RandomBlacklistSol.bytecode;
      }
    } else if (contractFeatures.length === 1) {
      if (contractFeatures.includes(Erc721ContractFeatures.RANDOM)) {
        return ERC721RandomSol.bytecode;
      }

      if (contractFeatures.includes(Erc721ContractFeatures.UPGRADEABLE)) {
        return ERC721UpgradeableSol.bytecode;
      }

      if (contractFeatures.includes(Erc721ContractFeatures.BLACKLIST)) {
        return ERC721BlackListSol.bytecode;
      }

      if (contractFeatures.includes(Erc721ContractFeatures.SOULBOUND)) {
        return ERC721SoulboundSol.bytecode;
      }
    }

    throw new BadRequestException("unsupportedCombination");
  }

  public getBytecodeByErc998ContractFeatures(contractFeatures: Array<Erc998ContractFeatures>) {
    if (!contractFeatures.length) {
      return ERC998SimpleSol.bytecode;
    }

    if (contractFeatures.length === 3) {
      return ERC998FullSol.bytecode;
    } else if (contractFeatures.length === 2) {
      if (
        contractFeatures.includes(Erc998ContractFeatures.UPGRADEABLE) &&
        contractFeatures.includes(Erc998ContractFeatures.RANDOM)
      ) {
        return ERC998UpgradeableRandomSol.bytecode;
      }
    } else if (contractFeatures.length === 1) {
      if (contractFeatures.includes(Erc998ContractFeatures.UPGRADEABLE)) {
        return ERC998UpgradeableSol.bytecode;
      }

      if (contractFeatures.includes(Erc998ContractFeatures.BLACKLIST)) {
        return ERC998BlackListSol.bytecode;
      }
    }

    throw new BadRequestException("unsupportedCombination");
  }

  public getBytecodeByErc1155ContractFeatures(contractFeatures: Array<Erc1155ContractFeatures>) {
    if (!contractFeatures.length) {
      return ERC1155SimpleSol.bytecode;
    }

    if (contractFeatures.includes(Erc1155ContractFeatures.BLACKLIST)) {
      return ERC1155BlackListSol.bytecode;
    }

    throw new BadRequestException("unsupportedCombination");
  }

  public getBytecodeByMysteryboxContractFeatures(contractFeatures: Array<MysteryboxContractFeatures>) {
    if (!contractFeatures.length) {
      return MysteryboxSimpleSol.bytecode;
    }

    if (contractFeatures.length === 2) {
      return MysteryboxFullSol.bytecode;
    } else if (contractFeatures.length === 1) {
      if (contractFeatures.includes(MysteryboxContractFeatures.BLACKLIST)) {
        return MysteryboxBlacklistSol.bytecode;
      }

      if (contractFeatures.includes(MysteryboxContractFeatures.PAUSABLE)) {
        return MysteryboxPausableSol.bytecode;
      }
    }

    throw new BadRequestException("unsupportedCombination");
  }
}
