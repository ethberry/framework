import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { hexlify, randomBytes, Wallet } from "ethers";

import { ETHERS_SIGNER } from "@gemunion/nestjs-ethers";
import type { IServerSignature } from "@gemunion/types-blockchain";
import type {
  ICollectionContractDeployDto,
  IErc1155ContractDeployDto,
  IErc20TokenDeployDto,
  IErc721ContractDeployDto,
  IErc998ContractDeployDto,
  ILotteryContractDeployDto,
  IMysteryContractDeployDto,
  IPyramidContractDeployDto,
  IRaffleContractDeployDto,
  IStakingContractDeployDto,
  IVestingContractDeployDto,
  IWaitListContractDeployDto,
} from "@framework/types";
import {
  CollectionContractTemplates,
  Erc1155ContractTemplates,
  Erc20ContractTemplates,
  Erc721ContractTemplates,
  Erc998ContractTemplates,
  ModuleType,
  MysteryContractTemplates,
  PyramidContractTemplates,
  StakingContractTemplates,
  TokenType,
} from "@framework/types";

import ERC20SimpleSol from "@framework/core-contracts/artifacts/contracts/ERC20/ERC20Simple.sol/ERC20Simple.json";
import ERC20BlacklistSol from "@framework/core-contracts/artifacts/contracts/ERC20/ERC20Blacklist.sol/ERC20Blacklist.json";
import ERC20WhitelistSol from "@framework/core-contracts/artifacts/contracts/ERC20/ERC20Whitelist.sol/ERC20Whitelist.json";

import VestingSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Vesting/Vesting.sol/Vesting.json";

import ERC721BlackListSol from "@framework/core-contracts/artifacts/contracts/ERC721/ERC721Blacklist.sol/ERC721Blacklist.json";
import ERC721RandomSol from "@framework/core-contracts/artifacts/contracts/ERC721/random/gemunion/ERC721RandomGemunion.sol/ERC721RandomGemunion.json";
import ERC721RentableSol from "@framework/core-contracts/artifacts/contracts/ERC721/ERC721Rentable.sol/ERC721Rentable.json";
import ERC721BlacklistRandomSol from "@framework/core-contracts/artifacts/contracts/ERC721/random/gemunion/ERC721BlacklistRandomGemunion.sol/ERC721BlacklistRandomGemunion.json";

import ERC721GenesSol from "@framework/core-contracts/artifacts/contracts/ERC721/traits/ERC721GenesGemunion.sol/ERC721GenesGemunion.json";
import ERC721UpgradeableRandomSol from "@framework/core-contracts/artifacts/contracts/ERC721/random/gemunion/ERC721UpgradeableRandomGemunion.sol/ERC721UpgradeableRandomGemunion.json";
import ERC721SimpleSol from "@framework/core-contracts/artifacts/contracts/ERC721/ERC721Simple.sol/ERC721Simple.json";
import ERC721SoulboundSol from "@framework/core-contracts/artifacts/contracts/ERC721/ERC721Soulbound.sol/ERC721Soulbound.json";
import ERC721SoulboundVotesSol from "@framework/core-contracts/artifacts/contracts/ERC721/ERC721SoulboundVotes.sol/ERC721SoulboundVotes.json";
import ERC721UpgradeableSol from "@framework/core-contracts/artifacts/contracts/ERC721/ERC721Upgradeable.sol/ERC721Upgradeable.json";
import ERC721BlacklistUpgradeableSol from "@framework/core-contracts/artifacts/contracts/ERC721/ERC721BlacklistUpgradeable.sol/ERC721BlacklistUpgradeable.json";
import ERC721BlacklistUpgradeableRandom from "@framework/core-contracts/artifacts/contracts/ERC721/random/gemunion/ERC721BlacklistUpgradeableRandomGemunion.sol/ERC721BlacklistUpgradeableRandomGemunion.json";
import ERC721BlacklistUpgradeableRentableSol from "@framework/core-contracts/artifacts/contracts/ERC721/ERC721BlacklistUpgradeableRentable.sol/ERC721BlacklistUpgradeableRentable.json";
import ERC721BlacklistUpgradeableRentableRandomSol from "@framework/core-contracts/artifacts/contracts/ERC721/random/gemunion/ERC721BlacklistUpgradeableRentableRandomGemunion.sol/ERC721BlacklistUpgradeableRentableRandomGemunion.json";
import ERC998BlacklistSol from "@framework/core-contracts/artifacts/contracts/ERC998/ERC998Blacklist.sol/ERC998Blacklist.json";
import ERC998ERC20SimpleSol from "@framework/core-contracts/artifacts/contracts/ERC998/ERC998ERC20Simple.sol/ERC998ERC20Simple.json";
import ERC998ERC1155SimpleSol from "@framework/core-contracts/artifacts/contracts/ERC998/ERC998ERC1155Simple.sol/ERC998ERC1155Simple.json";
import ERC998ERC1155ERC20Sol from "@framework/core-contracts/artifacts/contracts/ERC998/ERC998ERC1155ERC20.sol/ERC998ERC1155ERC20.json";
import ERC998GenesSol from "@framework/core-contracts/artifacts/contracts/ERC998/traits/ERC998GenesBesu.sol/ERC998GenesBesu.json";
import ERC998RandomSol from "@framework/core-contracts/artifacts/contracts/ERC998/random/gemunion/ERC998RandomGemunion.sol/ERC998RandomGemunion.json";
import ERC998RentableSol from "@framework/core-contracts/artifacts/contracts/ERC998/ERC998Rentable.sol/ERC998Rentable.json";
import ERC998BlacklistRandomSol from "@framework/core-contracts/artifacts/contracts/ERC998/random/gemunion/ERC998BlacklistRandomGemunion.sol/ERC998BlacklistRandomGemunion.json";
import ERC998SimpleSol from "@framework/core-contracts/artifacts/contracts/ERC998/ERC998Simple.sol/ERC998Simple.json";
import ERC998StateHashSol from "@framework/core-contracts/artifacts/contracts/ERC998/ERC998StateHash.sol/ERC998StateHash.json";
import ERC998UpgradeableSol from "@framework/core-contracts/artifacts/contracts/ERC998/ERC998Upgradeable.sol/ERC998Upgradeable.json";
import ERC998UpgradeableRandomSol from "@framework/core-contracts/artifacts/contracts/ERC998/random/gemunion/ERC998UpgradeableRandomGemunion.sol/ERC998UpgradeableRandomGemunion.json";
import ERC998BlacklistUpgradeableSol from "@framework/core-contracts/artifacts/contracts/ERC998/ERC998BlacklistUpgradeable.sol/ERC998BlacklistUpgradeable.json";
import ERC998BlacklistUpgradeableRandomSol from "@framework/core-contracts/artifacts/contracts/ERC998/random/gemunion/ERC998BlacklistUpgradeableRandomGemunion.sol/ERC998BlacklistUpgradeableRandomGemunion.json";

import ERC1155SimpleSol from "@framework/core-contracts/artifacts/contracts/ERC1155/ERC1155Simple.sol/ERC1155Simple.json";
import ERC1155BlackListSol from "@framework/core-contracts/artifacts/contracts/ERC1155/ERC1155Blacklist.sol/ERC1155Blacklist.json";
import ERC1155SoulboundSol from "@framework/core-contracts/artifacts/contracts/ERC1155/ERC1155Soulbound.sol/ERC1155Soulbound.json";

import MysteryBoxSimpleSol from "@framework/core-contracts/artifacts/contracts/Mechanics/MysteryBox/ERC721MysteryBoxSimple.sol/ERC721MysteryBoxSimple.json";
import MysteryBoxBlacklistSol from "@framework/core-contracts/artifacts/contracts/Mechanics/MysteryBox/ERC721MysteryBoxBlacklist.sol/ERC721MysteryBoxBlacklist.json";
import MysteryBoxPausableSol from "@framework/core-contracts/artifacts/contracts/Mechanics/MysteryBox/ERC721MysteryBoxPausable.sol/ERC721MysteryBoxPausable.json";
import MysteryBoxBlacklistPausableSol from "@framework/core-contracts/artifacts/contracts/Mechanics/MysteryBox/ERC721MysteryBoxBlacklistPausable.sol/ERC721MysteryBoxBlacklistPausable.json";

import ERC721CSimpleSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Collection/ERC721CSimple.sol/ERC721CSimple.json";
import ERC721CBlacklistSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Collection/ERC721CBlacklist.sol/ERC721CBlacklist.json";

import StakingSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Staking/Staking.sol/Staking.json";

import PyramidBasicSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Pyramid/PyramidBasic.sol/PyramidBasic.json";
import PyramidReferralSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Pyramid/Pyramid.sol/Pyramid.json";

import WaitListSol from "@framework/core-contracts/artifacts/contracts/Mechanics/WaitList/WaitList.sol/WaitList.json";

import RaffleSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Raffle/RaffleRandom.sol/RaffleRandom.json";
import RaffleTicketSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Raffle/ERC721RaffleTicket.sol/ERC721RaffleTicket.json";

import LotterySol from "@framework/core-contracts/artifacts/contracts/Mechanics/Lottery/LotteryRandom.sol/LotteryRandom.json";
import LotteryTicketSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Lottery/ERC721LotteryTicket.sol/ERC721LotteryTicket.json";

import { UserEntity } from "../../infrastructure/user/user.entity";
import { ContractManagerService } from "./contract-manager.service";

@Injectable()
export class ContractManagerSignService {
  constructor(
    @Inject(ETHERS_SIGNER)
    private readonly signer: Wallet,
    private readonly configService: ConfigService,
    private readonly contractManagerService: ContractManagerService,
  ) {}

  public async erc20Token(dto: IErc20TokenDeployDto, userEntity: UserEntity): Promise<IServerSignature> {
    const nonce = randomBytes(32);
    const bytecode = this.getBytecodeByErc20ContractTemplates(dto);

    await this.contractManagerService.validateDeployment(userEntity, ModuleType.HIERARCHY, TokenType.ERC20);

    const signature = await this.signer.signTypedData(
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
          { name: "params", type: "Params" },
          { name: "args", type: "Erc20Args" },
        ],
        Params: [
          { name: "nonce", type: "bytes32" },
          { name: "bytecode", type: "bytes" },
          { name: "externalId", type: "uint256" },
        ],
        Erc20Args: [
          { name: "name", type: "string" },
          { name: "symbol", type: "string" },
          { name: "cap", type: "uint256" },
          { name: "contractTemplate", type: "string" },
        ],
      },
      // Values
      {
        params: {
          nonce,
          bytecode,
          externalId: userEntity.id,
        },
        args: {
          contractTemplate: Object.values(Erc20ContractTemplates).indexOf(dto.contractTemplate).toString(),
          name: dto.name,
          symbol: dto.symbol,
          cap: dto.cap,
        },
      },
    );

    return { nonce: hexlify(nonce), signature, expiresAt: 0, bytecode };
  }

  public async erc721Token(dto: IErc721ContractDeployDto, userEntity: UserEntity): Promise<IServerSignature> {
    const nonce = randomBytes(32);
    const bytecode = this.getBytecodeByErc721ContractTemplates(dto);

    const moduleType =
      dto.contractTemplate === Erc721ContractTemplates.LOTTERY
        ? ModuleType.LOTTERY
        : dto.contractTemplate === Erc721ContractTemplates.RAFFLE
        ? ModuleType.RAFFLE
        : ModuleType.HIERARCHY;
    await this.contractManagerService.validateDeployment(userEntity, moduleType, TokenType.ERC721);

    const signature = await this.signer.signTypedData(
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
          externalId: userEntity.id,
        },
        args: {
          contractTemplate: Object.values(Erc721ContractTemplates).indexOf(dto.contractTemplate).toString(),
          name: dto.name,
          symbol: dto.symbol,
          baseTokenURI: dto.baseTokenURI,
          royalty: BigInt(dto.royalty),
        },
      },
    );
    return { nonce: hexlify(nonce), signature, expiresAt: 0, bytecode };
  }

  public async erc998Token(dto: IErc998ContractDeployDto, userEntity: UserEntity): Promise<IServerSignature> {
    const nonce = randomBytes(32);
    const bytecode = this.getBytecodeByErc998ContractTemplates(dto);

    await this.contractManagerService.validateDeployment(userEntity, ModuleType.HIERARCHY, TokenType.ERC998);

    const signature = await this.signer.signTypedData(
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
          { name: "params", type: "Params" },
          { name: "args", type: "Erc998Args" },
        ],
        Params: [
          { name: "nonce", type: "bytes32" },
          { name: "bytecode", type: "bytes" },
          { name: "externalId", type: "uint256" },
        ],
        Erc998Args: [
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
          externalId: userEntity.id,
        },
        args: {
          contractTemplate: Object.values(Erc998ContractTemplates).indexOf(dto.contractTemplate).toString(),
          name: dto.name,
          symbol: dto.symbol,
          baseTokenURI: dto.baseTokenURI,
          royalty: dto.royalty,
        },
      },
    );

    return { nonce: hexlify(nonce), signature, expiresAt: 0, bytecode };
  }

  public async erc1155Token(dto: IErc1155ContractDeployDto, userEntity: UserEntity): Promise<IServerSignature> {
    const nonce = randomBytes(32);
    const bytecode = this.getBytecodeByErc1155ContractTemplates(dto);

    await this.contractManagerService.validateDeployment(userEntity, ModuleType.HIERARCHY, TokenType.ERC1155);

    const signature = await this.signer.signTypedData(
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
          { name: "params", type: "Params" },
          { name: "args", type: "Erc1155Args" },
        ],
        Params: [
          { name: "nonce", type: "bytes32" },
          { name: "bytecode", type: "bytes" },
          { name: "externalId", type: "uint256" },
        ],
        Erc1155Args: [
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
          externalId: userEntity.id,
        },
        args: {
          contractTemplate: Object.values(Erc1155ContractTemplates).indexOf(dto.contractTemplate).toString(),
          baseTokenURI: dto.baseTokenURI,
          royalty: dto.royalty,
        },
      },
    );

    return { nonce: hexlify(nonce), signature, expiresAt: 0, bytecode };
  }

  // MODULE:MYSTERY
  public async mystery(dto: IMysteryContractDeployDto, userEntity: UserEntity): Promise<IServerSignature> {
    const nonce = randomBytes(32);
    const bytecode = this.getBytecodeByMysteryContractTemplates(dto);

    await this.contractManagerService.validateDeployment(userEntity, ModuleType.MYSTERY, TokenType.ERC721);

    const signature = await this.signer.signTypedData(
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
          { name: "params", type: "Params" },
          { name: "args", type: "MysteryArgs" },
        ],
        Params: [
          { name: "nonce", type: "bytes32" },
          { name: "bytecode", type: "bytes" },
          { name: "externalId", type: "uint256" },
        ],
        MysteryArgs: [
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
          externalId: userEntity.id,
        },
        args: {
          contractTemplate: Object.values(MysteryContractTemplates).indexOf(dto.contractTemplate).toString(),
          name: dto.name,
          symbol: dto.symbol,
          baseTokenURI: dto.baseTokenURI,
          royalty: dto.royalty,
        },
      },
    );

    return { nonce: hexlify(nonce), signature, expiresAt: 0, bytecode };
  }

  // MODULE:VESTING
  public async vesting(dto: IVestingContractDeployDto, userEntity: UserEntity): Promise<IServerSignature> {
    const { beneficiary, startTimestamp, cliffInMonth, monthlyRelease } = dto;
    const nonce = randomBytes(32);
    const bytecode = this.getBytecodeByVestingContractTemplate(dto);

    await this.contractManagerService.validateDeployment(userEntity, ModuleType.VESTING, null);

    const signature = await this.signer.signTypedData(
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
          { name: "params", type: "Params" },
          { name: "args", type: "VestingArgs" },
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
      },
      // Values
      {
        params: {
          nonce,
          bytecode,
          externalId: userEntity.id,
        },
        args: {
          beneficiary,
          startTimestamp: Math.ceil(new Date(startTimestamp).getTime() / 1000), // in seconds
          cliffInMonth, // in seconds
          monthlyRelease,
        },
      },
    );

    return { nonce: hexlify(nonce), signature, expiresAt: 0, bytecode };
  }

  // MODULE:PYRAMID
  public async pyramid(dto: IPyramidContractDeployDto, userEntity: UserEntity): Promise<IServerSignature> {
    const nonce = randomBytes(32);
    const bytecode = this.getBytecodeByPyramidContractTemplate(dto);

    await this.contractManagerService.validateDeployment(userEntity, ModuleType.PYRAMID, null);

    const signature = await this.signer.signTypedData(
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
          { name: "params", type: "Params" },
          { name: "args", type: "PyramidArgs" },
        ],
        Params: [
          { name: "nonce", type: "bytes32" },
          { name: "bytecode", type: "bytes" },
          { name: "externalId", type: "uint256" },
        ],
        PyramidArgs: [
          { name: "payees", type: "address[]" },
          { name: "shares", type: "uint256[]" },
          { name: "contractTemplate", type: "string" },
        ],
      },
      // Values
      {
        params: {
          nonce,
          bytecode,
          externalId: userEntity.id,
        },
        args: {
          payees: dto.payees,
          shares: dto.shares,
          contractTemplate: Object.values(PyramidContractTemplates).indexOf(dto.contractTemplate).toString(),
        },
      },
    );
    return { nonce: hexlify(nonce), signature, expiresAt: 0, bytecode };
  }

  // MODULE:STAKING
  public async staking(dto: IStakingContractDeployDto, userEntity: UserEntity): Promise<IServerSignature> {
    const nonce = randomBytes(32);
    const bytecode = this.getBytecodeByStakingContractTemplate(dto);

    await this.contractManagerService.validateDeployment(userEntity, ModuleType.STAKING, null);

    const signature = await this.signer.signTypedData(
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
          { name: "params", type: "Params" },
          { name: "args", type: "StakingArgs" },
        ],
        Params: [
          { name: "nonce", type: "bytes32" },
          { name: "bytecode", type: "bytes" },
          { name: "externalId", type: "uint256" },
        ],
        StakingArgs: [{ name: "contractTemplate", type: "string" }],
      },
      // Values
      {
        params: {
          nonce,
          bytecode,
          externalId: userEntity.id,
        },
        args: {
          contractTemplate: Object.values(StakingContractTemplates).indexOf(dto.contractTemplate).toString(),
        },
      },
    );

    return { nonce: hexlify(nonce), signature, expiresAt: 0, bytecode };
  }

  // MODULE:WAITLIST
  public async waitList(dto: IWaitListContractDeployDto, userEntity: UserEntity): Promise<IServerSignature> {
    const nonce = randomBytes(32);
    const bytecode = this.getBytecodeByWaitListContractTemplate(dto);

    await this.contractManagerService.validateDeployment(userEntity, ModuleType.WAITLIST, null);

    const signature = await this.signer.signTypedData(
      // Domain
      {
        name: "ContractManager",
        version: "1.0.0",
        chainId: userEntity.chainId,
        verifyingContract: this.configService.get<string>("CONTRACT_MANAGER_ADDR", ""),
      },
      // Types
      {
        EIP712: [{ name: "params", type: "Params" }],
        Params: [
          { name: "nonce", type: "bytes32" },
          { name: "bytecode", type: "bytes" },
          { name: "externalId", type: "uint256" },
        ],
      },
      // Values
      {
        params: {
          nonce,
          bytecode,
          externalId: userEntity.id,
        },
      },
    );

    return { nonce: hexlify(nonce), signature, expiresAt: 0, bytecode };
  }

  // MODULE:RAFFLE
  public async raffle(dto: IRaffleContractDeployDto, userEntity: UserEntity): Promise<IServerSignature> {
    const nonce = randomBytes(32);
    const bytecode = this.getBytecodeByRaffleContractTemplate(dto);

    await this.contractManagerService.validateDeployment(userEntity, ModuleType.RAFFLE, null);

    const signature = await this.signer.signTypedData(
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
          { name: "params", type: "Params" },
          { name: "args", type: "RaffleArgs" },
        ],
        Params: [
          { name: "nonce", type: "bytes32" },
          { name: "bytecode", type: "bytes" },
          { name: "externalId", type: "uint256" },
        ],
        RaffleArgs: [{ name: "config", type: "RaffleConfig" }],
        RaffleConfig: [
          { name: "timeLagBeforeRelease", type: "uint256" },
          { name: "commission", type: "uint256" },
        ],
      },
      // Values
      {
        params: {
          nonce,
          bytecode,
          externalId: userEntity.id,
        },
        args: {
          config: dto.config,
        },
      },
    );

    return { nonce: hexlify(nonce), signature, expiresAt: 0, bytecode };
  }

  // MODULE:LOTTERY
  public async lottery(dto: ILotteryContractDeployDto, userEntity: UserEntity): Promise<IServerSignature> {
    const nonce = randomBytes(32);
    const bytecode = this.getBytecodeByLotteryContractTemplate(dto);

    await this.contractManagerService.validateDeployment(userEntity, ModuleType.LOTTERY, null);

    const signature = await this.signer.signTypedData(
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
          { name: "params", type: "Params" },
          { name: "args", type: "LotteryArgs" },
        ],
        Params: [
          { name: "nonce", type: "bytes32" },
          { name: "bytecode", type: "bytes" },
          { name: "externalId", type: "uint256" },
        ],
        LotteryArgs: [{ name: "config", type: "LotteryConfig" }],
        LotteryConfig: [
          { name: "timeLagBeforeRelease", type: "uint256" },
          { name: "commission", type: "uint256" },
        ],
      },
      // Values
      {
        params: {
          nonce,
          bytecode,
          externalId: userEntity.id,
        },
        args: {
          config: dto.config,
        },
      },
    );

    return { nonce: hexlify(nonce), signature, expiresAt: 0, bytecode };
  }

  // MODULE:COLLECTION
  public async collection(dto: ICollectionContractDeployDto, userEntity: UserEntity): Promise<IServerSignature> {
    const nonce = randomBytes(32);
    const bytecode = this.getBytecodeByCollectionTemplates(dto);

    await this.contractManagerService.validateDeployment(userEntity, ModuleType.COLLECTION, TokenType.ERC721);

    const signature = await this.signer.signTypedData(
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
          { name: "params", type: "Params" },
          { name: "args", type: "CollectionArgs" },
        ],
        Params: [
          { name: "nonce", type: "bytes32" },
          { name: "bytecode", type: "bytes" },
          { name: "externalId", type: "uint256" },
        ],
        CollectionArgs: [
          { name: "name", type: "string" },
          { name: "symbol", type: "string" },
          { name: "royalty", type: "uint96" },
          { name: "baseTokenURI", type: "string" },
          { name: "batchSize", type: "uint96" },
          { name: "contractTemplate", type: "string" },
        ],
      },
      // Values
      {
        params: {
          nonce,
          bytecode,
          externalId: userEntity.id,
        },
        args: {
          name: dto.name,
          symbol: dto.symbol,
          royalty: dto.royalty,
          baseTokenURI: dto.baseTokenURI,
          batchSize: dto.batchSize,
          contractTemplate: Object.values(CollectionContractTemplates).indexOf(dto.contractTemplate).toString(),
        },
      },
    );
    return { nonce: hexlify(nonce), signature, expiresAt: 0, bytecode };
  }

  public getBytecodeByErc20ContractTemplates(dto: IErc20TokenDeployDto) {
    const { contractTemplate } = dto;

    switch (contractTemplate) {
      case Erc20ContractTemplates.BLACKLIST:
        return ERC20BlacklistSol.bytecode;
      case Erc20ContractTemplates.WHITELIST:
        return ERC20WhitelistSol.bytecode;
      case Erc20ContractTemplates.SIMPLE:
        return ERC20SimpleSol.bytecode;
      default:
        throw new NotFoundException("templateNotFound");
    }
  }

  public getBytecodeByErc721ContractTemplates(dto: IErc721ContractDeployDto) {
    const { contractTemplate } = dto;
    switch (contractTemplate) {
      case Erc721ContractTemplates.BLACKLIST:
        return ERC721BlackListSol.bytecode;
      case Erc721ContractTemplates.GENES:
        return ERC721GenesSol.bytecode;
      case Erc721ContractTemplates.RANDOM:
        return ERC721RandomSol.bytecode;
      case Erc721ContractTemplates.RENTABLE:
        return ERC721RentableSol.bytecode;
      case Erc721ContractTemplates.BLACKLIST_RANDOM:
        return ERC721BlacklistRandomSol.bytecode;
      case Erc721ContractTemplates.SIMPLE:
        return ERC721SimpleSol.bytecode;
      case Erc721ContractTemplates.SOULBOUND:
        return ERC721SoulboundSol.bytecode;
      case Erc721ContractTemplates.SOULBOUND_VOTES:
        return ERC721SoulboundVotesSol.bytecode;
      case Erc721ContractTemplates.UPGRADEABLE:
        return ERC721UpgradeableSol.bytecode;
      case Erc721ContractTemplates.BLACKLIST_UPGRADEABLE:
        return ERC721BlacklistUpgradeableSol.bytecode;
      case Erc721ContractTemplates.UPGRADEABLE_RANDOM:
        return ERC721UpgradeableRandomSol.bytecode;
      case Erc721ContractTemplates.BLACKLIST_UPGRADEABLE_RANDOM:
        return ERC721BlacklistUpgradeableRandom.bytecode;
      case Erc721ContractTemplates.BLACKLIST_UPGRADEABLE_RENTABLE:
        return ERC721BlacklistUpgradeableRentableSol.bytecode;
      case Erc721ContractTemplates.BLACKLIST_UPGRADEABLE_RENTABLE_RANDOM:
        return ERC721BlacklistUpgradeableRentableRandomSol.bytecode;
      case Erc721ContractTemplates.RAFFLE:
        return RaffleTicketSol.bytecode;
      case Erc721ContractTemplates.LOTTERY:
        return LotteryTicketSol.bytecode;
      default:
        throw new NotFoundException("templateNotFound");
    }
  }

  public getBytecodeByErc998ContractTemplates(dto: IErc998ContractDeployDto) {
    const { contractTemplate } = dto;

    switch (contractTemplate) {
      case Erc998ContractTemplates.BLACKLIST:
        return ERC998BlacklistSol.bytecode;
      case Erc998ContractTemplates.ERC20OWNER:
        return ERC998ERC20SimpleSol.bytecode;
      case Erc998ContractTemplates.ERC1155OWNER:
        return ERC998ERC1155SimpleSol.bytecode;
      case Erc998ContractTemplates.ERC1155OWNER_ERC20OWNER:
        return ERC998ERC1155ERC20Sol.bytecode;
      case Erc998ContractTemplates.GENES:
        return ERC998GenesSol.bytecode;
      case Erc998ContractTemplates.RANDOM:
        return ERC998RandomSol.bytecode;
      case Erc998ContractTemplates.RENTABLE:
        return ERC998RentableSol.bytecode;
      case Erc998ContractTemplates.BLACKLIST_RANDOM:
        return ERC998BlacklistRandomSol.bytecode;
      case Erc998ContractTemplates.SIMPLE:
        return ERC998SimpleSol.bytecode;
      case Erc998ContractTemplates.STATEHASH:
        return ERC998StateHashSol.bytecode;
      case Erc998ContractTemplates.UPGRADEABLE:
        return ERC998UpgradeableSol.bytecode;
      case Erc998ContractTemplates.BLACKLIST_UPGRADEABLE:
        return ERC998BlacklistUpgradeableSol.bytecode;
      case Erc998ContractTemplates.UPGRADEABLE_RANDOM:
        return ERC998UpgradeableRandomSol.bytecode;
      case Erc998ContractTemplates.BLACKLIST_UPGRADEABLE_RANDOM:
        return ERC998BlacklistUpgradeableRandomSol.bytecode;
      default:
        throw new NotFoundException("templateNotFound");
    }
  }

  public getBytecodeByErc1155ContractTemplates(dto: IErc1155ContractDeployDto) {
    const { contractTemplate } = dto;

    switch (contractTemplate) {
      case Erc1155ContractTemplates.SIMPLE:
        return ERC1155SimpleSol.bytecode;
      case Erc1155ContractTemplates.BLACKLIST:
        return ERC1155BlackListSol.bytecode;
      case Erc1155ContractTemplates.SOULBOUND:
        return ERC1155SoulboundSol.bytecode;
      default:
        throw new NotFoundException("templateNotFound");
    }
  }

  // MODULE:VESTING
  public getBytecodeByVestingContractTemplate(_dto: IVestingContractDeployDto) {
    return VestingSol.bytecode;
  }

  // MODULE:MYSTERY
  public getBytecodeByMysteryContractTemplates(dto: IMysteryContractDeployDto) {
    const { contractTemplate } = dto;

    switch (contractTemplate) {
      case MysteryContractTemplates.SIMPLE:
        return MysteryBoxSimpleSol.bytecode;
      case MysteryContractTemplates.PAUSABLE:
        return MysteryBoxPausableSol.bytecode;
      case MysteryContractTemplates.BLACKLIST:
        return MysteryBoxBlacklistSol.bytecode;
      case MysteryContractTemplates.BLACKLIST_PAUSABLE:
        return MysteryBoxBlacklistPausableSol.bytecode;
      default:
        throw new NotFoundException("templateNotFound");
    }
  }

  // MODULE:COLLECTION
  public getBytecodeByCollectionTemplates(dto: ICollectionContractDeployDto) {
    const { contractTemplate } = dto;

    switch (contractTemplate) {
      case CollectionContractTemplates.SIMPLE:
        return ERC721CSimpleSol.bytecode;
      case CollectionContractTemplates.BLACKLIST:
        return ERC721CBlacklistSol.bytecode;
      default:
        throw new NotFoundException("templateNotFound");
    }
  }

  // MODULE:STAKING
  public getBytecodeByStakingContractTemplate(dto: IStakingContractDeployDto) {
    const { contractTemplate } = dto;

    switch (contractTemplate) {
      case StakingContractTemplates.SIMPLE:
        return StakingSol.bytecode;
      default:
        throw new NotFoundException("templateNotFound");
    }
  }

  // MODULE:PYRAMID
  public getBytecodeByPyramidContractTemplate(dto: IPyramidContractDeployDto) {
    const { contractTemplate } = dto;
    switch (contractTemplate) {
      case PyramidContractTemplates.SIMPLE:
        return PyramidBasicSol.bytecode;
      case PyramidContractTemplates.SPLITTER:
        return PyramidReferralSol.bytecode;
      case PyramidContractTemplates.REFERRAL:
        return PyramidReferralSol.bytecode;
      default:
        throw new NotFoundException("templateNotFound");
    }
  }

  // MODULE:WAITLIST
  public getBytecodeByWaitListContractTemplate(_dto: IWaitListContractDeployDto) {
    return WaitListSol.bytecode;
  }

  // MODULE:RAFFLE
  public getBytecodeByRaffleContractTemplate(_dto: IRaffleContractDeployDto) {
    return RaffleSol.bytecode;
  }

  // MODULE:LOTTERY
  public getBytecodeByLotteryContractTemplate(_dto: ILotteryContractDeployDto) {
    return LotterySol.bytecode;
  }
}
