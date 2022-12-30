import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { utils, Wallet } from "ethers";

import { ETHERS_SIGNER } from "@gemunion/nestjs-ethers";
import type { IServerSignature } from "@gemunion/types-blockchain";
import {
  Erc1155ContractFeatures,
  Erc20ContractFeatures,
  Erc721ContractFeatures,
  Erc998ContractFeatures,
  IErc1155ContractDeployDto,
  IErc20TokenDeployDto,
  IErc721CollectionDeployDto,
  IErc721ContractDeployDto,
  IErc998ContractDeployDto,
  IMysteryContractDeployDto,
  IPyramidContractDeployDto,
  IStakingDeployDto,
  IVestingDeployDto,
  MysteryContractFeatures,
  PyramidContractFeatures,
  VestingContractTemplate,
  StakingContractFeatures,
} from "@framework/types";

import ERC20SimpleSol from "@framework/core-contracts/artifacts/contracts/ERC20/ERC20Simple.sol/ERC20Simple.json";
import ERC20BlacklistSol from "@framework/core-contracts/artifacts/contracts/ERC20/ERC20Blacklist.sol/ERC20Blacklist.json";
import LinearVestingSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Vesting/LinearVesting.sol/LinearVesting.json";
import GradedVestingSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Vesting/GradedVesting.sol/GradedVesting.json";
import CliffVestingSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Vesting/CliffVesting.sol/CliffVesting.json";

import StakingSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Staking/Staking.sol/Staking.json";
import StakingReferralSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Staking/StakingRef.sol/StakingReferral.json";

import ERC721BlackListSol from "@framework/core-contracts/artifacts/contracts/ERC721/ERC721Blacklist.sol/ERC721Blacklist.json";
import ERC721FullSol from "@framework/core-contracts/artifacts/contracts/ERC721/ERC721Full.sol/ERC721Full.json";
import ERC721RandomSol from "@framework/core-contracts/artifacts/contracts/ERC721/ERC721Random.sol/ERC721Random.json";
import ERC721RandomBlacklistSol from "@framework/core-contracts/artifacts/contracts/ERC721/ERC721RandomBlacklist.sol/ERC721RandomBlacklist.json";

import ERC721GenesSol from "@framework/core-contracts/artifacts/contracts/ERC721/test/ERC721GenesBesu.sol/ERC721GenesBesu.json";
// TODO dev:only
// import ERC721GenesSol from "@framework/core-contracts/artifacts/contracts/ERC721/ERC721Genes.sol/ERC721Genes.json";
import ERC721SimpleSol from "@framework/core-contracts/artifacts/contracts/ERC721/ERC721Simple.sol/ERC721Simple.json";
import ERC721SoulboundSol from "@framework/core-contracts/artifacts/contracts/ERC721/ERC721Soulbound.sol/ERC721Soulbound.json";
import ERC721UpgradeableSol from "@framework/core-contracts/artifacts/contracts/ERC721/ERC721Upgradeable.sol/ERC721Upgradeable.json";
import ERC721UpgradeableBlacklistSol from "@framework/core-contracts/artifacts/contracts/ERC721/ERC721UpgradeableBlacklist.sol/ERC721UpgradeableBlacklist.json";
import ERC721UpgradeableRandomSol from "@framework/core-contracts/artifacts/contracts/ERC721/ERC721UpgradeableRandom.sol/ERC721UpgradeableRandom.json";
import ERC721CollectionSol from "@framework/core-contracts/artifacts/contracts/ERC721/ERC721Collection.sol/ERC721Collection.json";

import ERC998SimpleSol from "@framework/core-contracts/artifacts/contracts/ERC998/ERC998Simple.sol/ERC998Simple.json";
import ERC998BlackListSol from "@framework/core-contracts/artifacts/contracts/ERC998/ERC998Blacklist.sol/ERC998Blacklist.json";
import ERC998RandomSol from "@framework/core-contracts/artifacts/contracts/ERC998/ERC998Random.sol/ERC998Random.json";
import ERC998RandomBlacklistSol from "@framework/core-contracts/artifacts/contracts/ERC998/ERC998RandomBlacklist.sol/ERC998RandomBlacklist.json";
import ERC998GenesSol from "@framework/core-contracts/artifacts/contracts/ERC998/ERC998Genes.sol/ERC998Genes.json";
import ERC998UpgradeableSol from "@framework/core-contracts/artifacts/contracts/ERC998/ERC998Upgradeable.sol/ERC998Upgradeable.json";
import ERC998UpgradeableRandomSol from "@framework/core-contracts/artifacts/contracts/ERC998/ERC998UpgradeableRandom.sol/ERC998UpgradeableRandom.json";
import ERC998FullSol from "@framework/core-contracts/artifacts/contracts/ERC998/ERC998Full.sol/ERC998Full.json";
import ERC998ERC1155ERC20SimpleSol from "@framework/core-contracts/artifacts/contracts/ERC998/ERC998ERC1155ERC20Simple.sol/ERC998ERC1155ERC20Simple.json";
import ERC998ERC1155SimpleSol from "@framework/core-contracts/artifacts/contracts/ERC998/ERC998ERC1155Simple.sol/ERC998ERC1155Simple.json";
import ERC998ERC20SimpleSol from "@framework/core-contracts/artifacts/contracts/ERC998/ERC998ERC20Simple.sol/ERC998ERC20Simple.json";

import ERC1155SimpleSol from "@framework/core-contracts/artifacts/contracts/ERC1155/ERC1155Simple.sol/ERC1155Simple.json";
import ERC1155BlackListSol from "@framework/core-contracts/artifacts/contracts/ERC1155/ERC1155Blacklist.sol/ERC1155Blacklist.json";

import MysteryboxSimpleSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Mysterybox/ERC721MysteryboxSimple.sol/ERC721MysteryboxSimple.json";
import MysteryboxBlacklistSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Mysterybox/ERC721MysteryboxBlacklist.sol/ERC721MysteryboxBlacklist.json";
import MysteryboxPausableSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Mysterybox/ERC721MysteryboxPausable.sol/ERC721MysteryboxPausable.json";
import MysteryboxFullSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Mysterybox/ERC721MysteryboxFull.sol/ERC721MysteryboxFull.json";

import PyramidSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Pyramid/Pyramid.sol/Pyramid.json";

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
    const bytecode = this.getBytecodeByErc20ContractFeatures(dto);

    const c = {
      bytecode,
      name,
      symbol,
      cap,
      featureIds: contractFeatures.map(feature => Object.keys(Erc20ContractFeatures).indexOf(feature)),
      nonce,
    };

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
      // Value
      { c },
    );

    return { nonce: utils.hexlify(nonce), signature, expiresAt: 0, bytecode };
  }

  public async erc721Token(dto: IErc721ContractDeployDto, userEntity: UserEntity): Promise<IServerSignature> {
    const { contractFeatures, name, symbol, royalty, baseTokenURI } = dto;

    const nonce = utils.randomBytes(32);
    const bytecode = this.getBytecodeByErc721ContractFeatures(dto);

    const c = {
      bytecode,
      name,
      symbol,
      baseTokenURI,
      featureIds: contractFeatures.map(feature => Object.keys(Erc721ContractFeatures).indexOf(feature)),
      royalty,
      nonce,
    };

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
      // Value
      { c },
    );
    return { nonce: utils.hexlify(nonce), signature, expiresAt: 0, bytecode };
  }

  public async erc721Collection(dto: IErc721CollectionDeployDto, userEntity: UserEntity): Promise<IServerSignature> {
    const { contractFeatures, name, symbol, royalty, baseTokenURI, batchSize } = dto;

    const nonce = utils.randomBytes(32);
    const bytecode = this.getBytecodeByErc721CollectionFeatures(dto);

    const c = {
      bytecode,
      name,
      symbol,
      baseTokenURI,
      featureIds: contractFeatures.map(feature => Object.keys(Erc721ContractFeatures).indexOf(feature)),
      royalty,
      batchSize,
      nonce,
    };

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
      // Value
      { c },
    );
    return { nonce: utils.hexlify(nonce), signature, expiresAt: 0, bytecode };
  }

  public async erc998Token(dto: IErc998ContractDeployDto, userEntity: UserEntity): Promise<IServerSignature> {
    const { contractFeatures, name, symbol, royalty, baseTokenURI } = dto;

    const nonce = utils.randomBytes(32);
    const bytecode = this.getBytecodeByErc998ContractFeatures(dto);

    const c = {
      bytecode,
      name,
      symbol,
      royalty,
      baseTokenURI,
      featureIds: contractFeatures.map(feature => Object.keys(Erc998ContractFeatures).indexOf(feature)),
      nonce,
    };
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
        EIP712: [{ name: "c", type: "Erc998" }],
        Erc998: [
          { name: "bytecode", type: "bytes" },
          { name: "name", type: "string" },
          { name: "symbol", type: "string" },
          { name: "royalty", type: "uint96" },
          { name: "baseTokenURI", type: "string" },
          { name: "featureIds", type: "uint8[]" },
          { name: "nonce", type: "bytes32" },
        ],
      },
      // Value
      { c },
    );

    return { nonce: utils.hexlify(nonce), signature, expiresAt: 0, bytecode };
  }

  public async erc1155Token(dto: IErc1155ContractDeployDto, userEntity: UserEntity): Promise<IServerSignature> {
    const { contractFeatures, royalty, baseTokenURI } = dto;

    const nonce = utils.randomBytes(32);
    const bytecode = this.getBytecodeByErc1155ContractFeatures(dto);

    const c = {
      bytecode,
      royalty,
      baseTokenURI,
      featureIds: contractFeatures.map(feature => Object.keys(Erc1155ContractFeatures).indexOf(feature)),
      nonce,
    };
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
        EIP712: [{ name: "c", type: "Erc1155" }],
        Erc1155: [
          { name: "bytecode", type: "bytes" },
          { name: "royalty", type: "uint96" },
          { name: "baseTokenURI", type: "string" },
          { name: "featureIds", type: "uint8[]" },
          { name: "nonce", type: "bytes32" },
        ],
      },
      // Value
      { c },
    );

    return { nonce: utils.hexlify(nonce), signature, expiresAt: 0, bytecode };
  }

  // MODULE:PYRAMID
  public async pyramid(dto: IPyramidContractDeployDto, userEntity: UserEntity): Promise<IServerSignature> {
    const { contractFeatures } = dto;
    const nonce = utils.randomBytes(32);
    const bytecode = this.getBytecodeByPyramidContractFeatures(dto);
    const p = {
      bytecode,
      featureIds: contractFeatures.map(feature => Object.keys(PyramidContractFeatures).indexOf(feature)),
      nonce,
    };
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
        EIP712: [{ name: "p", type: "Pyramid" }],
        Pyramid: [
          { name: "bytecode", type: "bytes" },
          { name: "featureIds", type: "uint8[]" },
          { name: "nonce", type: "bytes32" },
        ],
      },
      // Value
      { p },
    );
    return { nonce: utils.hexlify(nonce), signature, expiresAt: 0, bytecode };
  }

  // MODULE:MYSTERY
  public async mysterybox(dto: IMysteryContractDeployDto, userEntity: UserEntity): Promise<IServerSignature> {
    const { contractFeatures, name, symbol, royalty, baseTokenURI } = dto;
    const nonce = utils.randomBytes(32);
    const bytecode = this.getBytecodeByMysteryContractFeatures(dto);

    const m = {
      bytecode,
      name,
      symbol,
      royalty,
      baseTokenURI,
      featureIds: contractFeatures.map(feature => Object.keys(MysteryContractFeatures).indexOf(feature)),
      nonce,
    };
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
        EIP712: [{ name: "m", type: "Mystery" }],
        Mystery: [
          { name: "bytecode", type: "bytes" },
          { name: "name", type: "string" },
          { name: "symbol", type: "string" },
          { name: "royalty", type: "uint96" },
          { name: "baseTokenURI", type: "string" },
          { name: "featureIds", type: "uint8[]" },
          { name: "nonce", type: "bytes32" },
        ],
      },
      // Value
      { m },
    );

    return { nonce: utils.hexlify(nonce), signature, expiresAt: 0, bytecode };
  }

  // MODULE:VESTING
  public async vesting(dto: IVestingDeployDto, userEntity: UserEntity): Promise<IServerSignature> {
    const { contractTemplate, account, startTimestamp, duration } = dto;

    const nonce = utils.randomBytes(32);
    const bytecode = this.getBytecodeByVestingContractTemplate(contractTemplate);

    const v = {
      bytecode,
      account,
      startTimestamp: Math.ceil(new Date(startTimestamp).getTime() / 1000), // in seconds
      duration: duration * 60 * 60 * 24, // in seconds
      templateId: Object.keys(VestingContractTemplate).indexOf(contractTemplate),
      nonce,
    };
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
        EIP712: [{ name: "v", type: "Vesting" }],
        Vesting: [
          { name: "bytecode", type: "bytes" },
          { name: "account", type: "address" },
          { name: "startTimestamp", type: "uint64" },
          { name: "duration", type: "uint64" },
          { name: "templateId", type: "uint256" },
          { name: "nonce", type: "bytes32" },
        ],
      },
      // Value
      { v },
    );

    return { nonce: utils.hexlify(nonce), signature, expiresAt: 0, bytecode };
  }

  // MODULE:STAKING
  public async staking(dto: IStakingDeployDto, userEntity: UserEntity): Promise<IServerSignature> {
    const { contractFeatures, maxStake } = dto;

    const nonce = utils.randomBytes(32);
    const bytecode = this.getBytecodeByStakingContractFeatures(dto);

    const s = {
      bytecode,
      maxStake,
      featureIds: contractFeatures.map(feature => Object.keys(StakingContractFeatures).indexOf(feature)),
      nonce,
    };
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
        EIP712: [{ name: "s", type: "Staking" }],
        Staking: [
          { name: "bytecode", type: "bytes" },
          { name: "maxStake", type: "uint256" },
          { name: "featureIds", type: "uint8[]" },
          { name: "nonce", type: "bytes32" },
        ],
      },
      // Value
      { s },
    );

    return { nonce: utils.hexlify(nonce), signature, expiresAt: 0, bytecode };
  }

  public getBytecodeByErc20ContractFeatures(dto: IErc20TokenDeployDto) {
    const { contractFeatures } = dto;

    if (!contractFeatures.length) {
      return ERC20SimpleSol.bytecode;
    }

    if (contractFeatures.includes(Erc20ContractFeatures.BLACKLIST)) {
      return ERC20BlacklistSol.bytecode;
    }

    throw this.throwValidationError(dto);
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

  public getBytecodeByStakingContractFeatures(dto: IStakingDeployDto) {
    const { contractFeatures } = dto;

    if (!contractFeatures.length) {
      return StakingSol.bytecode;
    }

    if (contractFeatures.length === 1 && contractFeatures.includes(StakingContractFeatures.LINEAR_REFERRAL)) {
      return StakingReferralSol.bytecode;
    }

    throw this.throwValidationError(dto);
  }

  public getBytecodeByErc721ContractFeatures(dto: IErc721ContractDeployDto) {
    const { contractFeatures } = dto;

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

      if (contractFeatures.includes(Erc721ContractFeatures.GENES)) {
        return ERC721GenesSol.bytecode;
      }
    }

    throw this.throwValidationError(dto);
  }

  // MODULE:COLLECTION
  public getBytecodeByErc721CollectionFeatures(dto: IErc721CollectionDeployDto) {
    const { contractFeatures } = dto;

    if (!contractFeatures.length) {
      return ERC721CollectionSol.bytecode;
    }

    throw this.throwValidationError(dto);
  }

  public getBytecodeByErc998ContractFeatures(dto: IErc998ContractDeployDto) {
    const { contractFeatures } = dto;

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
      if (
        contractFeatures.includes(Erc998ContractFeatures.BLACKLIST) &&
        contractFeatures.includes(Erc998ContractFeatures.RANDOM)
      ) {
        return ERC998RandomBlacklistSol.bytecode;
      }
      if (
        contractFeatures.includes(Erc998ContractFeatures.ERC20OWNER) &&
        contractFeatures.includes(Erc998ContractFeatures.ERC1155OWNER)
      ) {
        return ERC998ERC1155ERC20SimpleSol.bytecode;
      }
    } else if (contractFeatures.length === 1) {
      if (contractFeatures.includes(Erc998ContractFeatures.UPGRADEABLE)) {
        return ERC998UpgradeableSol.bytecode;
      }

      if (contractFeatures.includes(Erc998ContractFeatures.BLACKLIST)) {
        return ERC998BlackListSol.bytecode;
      }

      if (contractFeatures.includes(Erc998ContractFeatures.RANDOM)) {
        return ERC998RandomSol.bytecode;
      }

      if (contractFeatures.includes(Erc998ContractFeatures.ERC20OWNER)) {
        return ERC998ERC20SimpleSol.bytecode;
      }

      if (contractFeatures.includes(Erc998ContractFeatures.ERC1155OWNER)) {
        return ERC998ERC1155SimpleSol.bytecode;
      }

      if (contractFeatures.includes(Erc998ContractFeatures.GENES)) {
        return ERC998GenesSol.bytecode;
      }
    }

    throw this.throwValidationError(dto);
  }

  public getBytecodeByErc1155ContractFeatures(dto: IErc1155ContractDeployDto) {
    const { contractFeatures } = dto;

    if (!contractFeatures.length) {
      return ERC1155SimpleSol.bytecode;
    }

    if (contractFeatures.includes(Erc1155ContractFeatures.BLACKLIST)) {
      return ERC1155BlackListSol.bytecode;
    }

    throw this.throwValidationError(dto);
  }

  public getBytecodeByMysteryContractFeatures(dto: IMysteryContractDeployDto) {
    const { contractFeatures } = dto;

    if (!contractFeatures.length) {
      return MysteryboxSimpleSol.bytecode;
    }

    if (contractFeatures.length === 2) {
      return MysteryboxFullSol.bytecode;
    } else if (contractFeatures.length === 1) {
      if (contractFeatures.includes(MysteryContractFeatures.BLACKLIST)) {
        return MysteryboxBlacklistSol.bytecode;
      }

      if (contractFeatures.includes(MysteryContractFeatures.PAUSABLE)) {
        return MysteryboxPausableSol.bytecode;
      }
    }

    throw this.throwValidationError(dto);
  }

  public getBytecodeByPyramidContractFeatures(dto: IPyramidContractDeployDto) {
    const { contractFeatures } = dto;

    if (!contractFeatures.length) {
      return PyramidSol.bytecode;
    }

    if (contractFeatures.includes(PyramidContractFeatures.LINEAR_REFERRAL)) {
      return PyramidSol.bytecode;
    }

    throw this.throwValidationError(dto);
  }

  public throwValidationError(dto: any) {
    return new BadRequestException([
      {
        target: dto,
        value: dto.contractFeatures,
        property: "contractFeatures",
        children: [],
        constraints: { isEnum: "unsupportedCombination" },
      },
    ]);
  }
}
