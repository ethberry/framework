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
  // IRaffleContractDeployDto,
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
import ERC721DiscreteRandomSol from "@framework/core-contracts/artifacts/contracts/ERC721/random/gemunion/ERC721DiscreteRandomGemunion.sol/ERC721DiscreteRandomGemunion.json";
import ERC721SimpleSol from "@framework/core-contracts/artifacts/contracts/ERC721/ERC721Simple.sol/ERC721Simple.json";
import ERC721SoulboundSol from "@framework/core-contracts/artifacts/contracts/ERC721/ERC721Soulbound.sol/ERC721Soulbound.json";
import ERC721SoulboundVotesSol from "@framework/core-contracts/artifacts/contracts/ERC721/ERC721SoulboundVotes.sol/ERC721SoulboundVotes.json";
import ERC721DiscreteSol from "@framework/core-contracts/artifacts/contracts/ERC721/ERC721Discrete.sol/ERC721Discrete.json";
import ERC721BlacklistDiscreteSol from "@framework/core-contracts/artifacts/contracts/ERC721/ERC721BlacklistDiscrete.sol/ERC721BlacklistDiscrete.json";
import ERC721BlacklistDiscreteRandom from "@framework/core-contracts/artifacts/contracts/ERC721/random/gemunion/ERC721BlacklistDiscreteRandomGemunion.sol/ERC721BlacklistDiscreteRandomGemunion.json";
import ERC721BlacklistDiscreteRentableSol from "@framework/core-contracts/artifacts/contracts/ERC721/ERC721BlacklistDiscreteRentable.sol/ERC721BlacklistDiscreteRentable.json";
import ERC721BlacklistDiscreteRentableRandomSol from "@framework/core-contracts/artifacts/contracts/ERC721/random/gemunion/ERC721BlacklistDiscreteRentableRandomGemunion.sol/ERC721BlacklistDiscreteRentableRandomGemunion.json";
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
import ERC998DiscreteSol from "@framework/core-contracts/artifacts/contracts/ERC998/ERC998Discrete.sol/ERC998Discrete.json";
import ERC998DiscreteRandomSol from "@framework/core-contracts/artifacts/contracts/ERC998/random/gemunion/ERC998DiscreteRandomGemunion.sol/ERC998DiscreteRandomGemunion.json";
import ERC998BlacklistDiscreteSol from "@framework/core-contracts/artifacts/contracts/ERC998/ERC998BlacklistDiscrete.sol/ERC998BlacklistDiscrete.json";
import ERC998BlacklistDiscreteRandomSol from "@framework/core-contracts/artifacts/contracts/ERC998/random/gemunion/ERC998BlacklistDiscreteRandomGemunion.sol/ERC998BlacklistDiscreteRandomGemunion.json";

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

// import RaffleSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Raffle/random/RaffleRandomGemunion.sol/RaffleRandomGemunion.json";
import RaffleSol13378 from "@framework/core-contracts/artifacts/contracts/Mechanics/Raffle/random/RaffleRandomBesu.sol/RaffleRandomBesu.json";
import RaffleSol13377 from "@framework/core-contracts/artifacts/contracts/Mechanics/Raffle/random/RaffleRandomGemunion.sol/RaffleRandomGemunion.json";
import RaffleSol5 from "@framework/core-contracts/artifacts/contracts/Mechanics/Raffle/random/RaffleRandomGoerli.sol/RaffleRandomGoerli.json";
// eslint-disable-next-line import/no-duplicates
import RaffleSol56 from "@framework/core-contracts/artifacts/contracts/Mechanics/Raffle/random/RaffleRandomBinance.sol/RaffleRandomBinance.json";
// eslint-disable-next-line import/no-duplicates
import RaffleSol97 from "@framework/core-contracts/artifacts/contracts/Mechanics/Raffle/random/RaffleRandomBinance.sol/RaffleRandomBinance.json";
import RaffleTicketSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Raffle/ERC721RaffleTicket.sol/ERC721RaffleTicket.json";

// import LotterySol from "@framework/core-contracts/artifacts/contracts/Mechanics/Lottery/random/LotteryRandomGemunion.sol/LotteryRandomGemunion.json";
import LotterySol13378 from "@framework/core-contracts/artifacts/contracts/Mechanics/Lottery/random/LotteryRandomBesu.sol/LotteryRandomBesu.json";
import LotterySol13377 from "@framework/core-contracts/artifacts/contracts/Mechanics/Lottery/random/LotteryRandomGemunion.sol/LotteryRandomGemunion.json";
import LotterySol5 from "@framework/core-contracts/artifacts/contracts/Mechanics/Lottery/random/LotteryRandomGoerli.sol/LotteryRandomGoerli.json";
// eslint-disable-next-line import/no-duplicates
import LotterySol56 from "@framework/core-contracts/artifacts/contracts/Mechanics/Lottery/random/LotteryRandomBinance.sol/LotteryRandomBinance.json";
// eslint-disable-next-line import/no-duplicates
import LotterySol97 from "@framework/core-contracts/artifacts/contracts/Mechanics/Lottery/random/LotteryRandomBinance.sol/LotteryRandomBinance.json";
import LotteryTicketSol from "@framework/core-contracts/artifacts/contracts/Mechanics/Lottery/ERC721LotteryTicket.sol/ERC721LotteryTicket.json";

import { UserEntity } from "../../infrastructure/user/user.entity";
import { ContractManagerService } from "./contract-manager.service";
import { AssetEntity } from "../exchange/asset/asset.entity";

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
          contractTemplate: Object.values(Erc721ContractTemplates).indexOf(dto.contractTemplate),
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
  public async vesting(
    dto: IVestingContractDeployDto,
    userEntity: UserEntity,
    asset?: AssetEntity,
  ): Promise<IServerSignature> {
    const { beneficiary, startTimestamp, cliffInMonth, monthlyRelease, externalId } = dto;
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
          externalId: externalId || userEntity.id,
        },
        args: {
          beneficiary: beneficiary.toLowerCase(),
          startTimestamp: Math.ceil(new Date(startTimestamp).getTime() / 1000), // in seconds
          cliffInMonth, // in seconds
          monthlyRelease,
        },
        // items: [],
        items: asset
          ? asset.components.map(component => ({
              tokenType: Object.values(TokenType).indexOf(component.tokenType),
              token: component.contract.address,
              tokenId: (component.templateId || 0).toString(), // suppression types check with 0
              amount: component.amount,
            }))
          : [],
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
  public async raffle(userEntity: UserEntity): Promise<IServerSignature> {
    const nonce = randomBytes(32);
    const bytecode = this.getBytecodeByRaffleContractTemplate(userEntity.chainId);

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

  // MODULE:LOTTERY
  public async lottery(dto: ILotteryContractDeployDto, userEntity: UserEntity): Promise<IServerSignature> {
    const nonce = randomBytes(32);
    const bytecode = this.getBytecodeByLotteryContractTemplate(dto, userEntity.chainId);

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
      case Erc721ContractTemplates.DISCRETE:
        return ERC721DiscreteSol.bytecode;
      case Erc721ContractTemplates.BLACKLIST_DISCRETE:
        return ERC721BlacklistDiscreteSol.bytecode;
      case Erc721ContractTemplates.DISCRETE_RANDOM:
        return ERC721DiscreteRandomSol.bytecode;
      case Erc721ContractTemplates.BLACKLIST_DISCRETE_RANDOM:
        return ERC721BlacklistDiscreteRandom.bytecode;
      case Erc721ContractTemplates.BLACKLIST_DISCRETE_RENTABLE:
        return ERC721BlacklistDiscreteRentableSol.bytecode;
      case Erc721ContractTemplates.BLACKLIST_DISCRETE_RENTABLE_RANDOM:
        return ERC721BlacklistDiscreteRentableRandomSol.bytecode;
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
      case Erc998ContractTemplates.DISCRETE:
        return ERC998DiscreteSol.bytecode;
      case Erc998ContractTemplates.BLACKLIST_DISCRETE:
        return ERC998BlacklistDiscreteSol.bytecode;
      case Erc998ContractTemplates.DISCRETE_RANDOM:
        return ERC998DiscreteRandomSol.bytecode;
      case Erc998ContractTemplates.BLACKLIST_DISCRETE_RANDOM:
        return ERC998BlacklistDiscreteRandomSol.bytecode;
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
  public getBytecodeByRaffleContractTemplate(chainId: number) {
    switch (chainId) {
      case 13378:
        return RaffleSol13378.bytecode;
      case 13377:
        return RaffleSol13377.bytecode;
      case 5:
        return RaffleSol5.bytecode;
      case 56:
        return RaffleSol56.bytecode;
      case 97:
        return RaffleSol97.bytecode;
      default:
        throw new NotFoundException("chainNotFound");
    }
  }

  // MODULE:LOTTERY
  public getBytecodeByLotteryContractTemplate(_dto: ILotteryContractDeployDto, chainId: number) {
    switch (chainId) {
      case 13378:
        return LotterySol13378.bytecode;
      case 13377:
        return LotterySol13377.bytecode;
      case 5:
        return LotterySol5.bytecode;
      case 56:
        return LotterySol56.bytecode;
      case 97:
        return LotterySol97.bytecode;
      default:
        throw new NotFoundException("chainNotFound");
    }
  }
}
