import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { hexlify, randomBytes, Wallet } from "ethers";

import { ETHERS_SIGNER } from "@gemunion/nest-js-module-ethers-gcp";
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

import { UserEntity } from "../../infrastructure/user/user.entity";
import { ContractManagerService } from "./contract-manager.service";
import { AssetEntity } from "../exchange/asset/asset.entity";
import { getContractABI } from "./utils";

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
    const { bytecode } = await this.getBytecodeByErc20ContractTemplates(dto, userEntity.chainId);

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
    const { bytecode } = await this.getBytecodeByErc721ContractTemplates(dto, userEntity.chainId);

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
    const { bytecode } = await this.getBytecodeByErc998ContractTemplates(dto, userEntity.chainId);

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
    const { bytecode } = await this.getBytecodeByErc1155ContractTemplates(dto, userEntity.chainId);

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
    const { bytecode } = await this.getBytecodeByMysteryContractTemplates(dto, userEntity.chainId);

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
    const { bytecode } = await this.getBytecodeByVestingContractTemplate(dto, userEntity.chainId);

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
    const { bytecode } = await this.getBytecodeByPyramidContractTemplate(dto, userEntity.chainId);

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
    const { bytecode } = await this.getBytecodeByStakingContractTemplate(dto, userEntity.chainId);

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
    const { bytecode } = await this.getBytecodeByWaitListContractTemplate(dto, userEntity.chainId);

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
    const { bytecode } = await this.getBytecodeByRaffleContractTemplate(userEntity.chainId);

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
    const { bytecode } = await this.getBytecodeByLotteryContractTemplate(dto, userEntity.chainId);

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
    const { bytecode } = await this.getBytecodeByCollectionTemplates(dto, userEntity.chainId);

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

  public getBytecodeByErc20ContractTemplates(dto: IErc20TokenDeployDto, chainId: number) {
    const { contractTemplate } = dto;

    switch (contractTemplate) {
      case Erc20ContractTemplates.BLACKLIST:
        return getContractABI(
          "@framework/core-contracts/artifacts/contracts/ERC20/ERC20Blacklist.sol/ERC20Blacklist.json",
          chainId,
        );
      case Erc20ContractTemplates.WHITELIST:
        return getContractABI(
          "@framework/core-contracts/artifacts/contracts/ERC20/ERC20Whitelist.sol/ERC20Whitelist.json",
          chainId,
        );
      case Erc20ContractTemplates.SIMPLE:
        return getContractABI(
          "@framework/core-contracts/artifacts/contracts/ERC20/ERC20Simple.sol/ERC20Simple.json",
          chainId,
        );
      default:
        throw new NotFoundException("templateNotFound");
    }
  }

  public getBytecodeByErc721ContractTemplates(dto: IErc721ContractDeployDto, chainId: number) {
    const { contractTemplate } = dto;
    switch (contractTemplate) {
      case Erc721ContractTemplates.BLACKLIST:
        return getContractABI(
          "@framework/core-contracts/artifacts/contracts/ERC721/ERC721Blacklist.sol/ERC721Blacklist.json",
          chainId,
        );
      case Erc721ContractTemplates.GENES:
        return getContractABI(
          "@framework/core-contracts/artifacts/contracts/ERC721/traits/ERC721Genes.sol/ERC721Genes.json",
          chainId,
        );
      case Erc721ContractTemplates.RANDOM:
        return getContractABI(
          "@framework/core-contracts/artifacts/contracts/ERC721/random/ERC721Random.sol/ERC721Random.json",
          chainId,
        );
      case Erc721ContractTemplates.RENTABLE:
        return getContractABI(
          "@framework/core-contracts/artifacts/contracts/ERC721/ERC721Rentable.sol/ERC721Rentable.json",
          chainId,
        );
      case Erc721ContractTemplates.BLACKLIST_RANDOM:
        return getContractABI(
          "@framework/core-contracts/artifacts/contracts/ERC721/random/ERC721BlacklistRandom.sol/ERC721BlacklistRandom.json",
          chainId,
        );
      case Erc721ContractTemplates.SIMPLE:
        return getContractABI(
          "@framework/core-contracts/artifacts/contracts/ERC721/ERC721Simple.sol/ERC721Simple.json",
          chainId,
        );
      case Erc721ContractTemplates.SOULBOUND:
        return getContractABI(
          "@framework/core-contracts/artifacts/contracts/ERC721/ERC721Soulbound.sol/ERC721Soulbound.json",
          chainId,
        );
      case Erc721ContractTemplates.SOULBOUND_VOTES:
        return getContractABI(
          "@framework/core-contracts/artifacts/contracts/ERC721/ERC721SoulboundVotes.sol/ERC721SoulboundVotes.json",
          chainId,
        );
      case Erc721ContractTemplates.DISCRETE:
        return getContractABI(
          "@framework/core-contracts/artifacts/contracts/ERC721/ERC721Discrete.sol/ERC721Discrete.json",
          chainId,
        );
      case Erc721ContractTemplates.BLACKLIST_DISCRETE:
        return getContractABI(
          "@framework/core-contracts/artifacts/contracts/ERC721/ERC721BlacklistDiscrete.sol/ERC721BlacklistDiscrete.json",
          chainId,
        );
      case Erc721ContractTemplates.DISCRETE_RANDOM:
        return getContractABI(
          "@framework/core-contracts/artifacts/contracts/ERC721/random/ERC721DiscreteRandom.sol/ERC721DiscreteRandom.json",
          chainId,
        );
      case Erc721ContractTemplates.BLACKLIST_DISCRETE_RANDOM:
        return getContractABI(
          "@framework/core-contracts/artifacts/contracts/ERC721//randomERC721BlacklistDiscreteRandom.sol/ERC721BlacklistDiscreteRandom.json",
          chainId,
        );
      case Erc721ContractTemplates.BLACKLIST_DISCRETE_RENTABLE:
        return getContractABI(
          "@framework/core-contracts/artifacts/contracts/ERC721/ERC721BlacklistDiscreteRentable.sol/ERC721BlacklistDiscreteRentable.json",
          chainId,
        );
      case Erc721ContractTemplates.BLACKLIST_DISCRETE_RENTABLE_RANDOM:
        return getContractABI(
          "@framework/core-contracts/artifacts/contracts/ERC721/random/ERC721BlacklistDiscreteRentableRandom.sol/ERC721BlacklistDiscreteRentableRandom.json",
          chainId,
        );
      case Erc721ContractTemplates.RAFFLE:
        return getContractABI(
          "@framework/core-contracts/artifacts/contracts/Mechanics/Raffle/ERC721RaffleTicket.sol/ERC721RaffleTicket.json",
          chainId,
        );
      case Erc721ContractTemplates.LOTTERY:
        return getContractABI(
          "@framework/core-contracts/artifacts/contracts/Mechanics/Lottery/ERC721LotteryTicket.sol/ERC721LotteryTicket.json",
          chainId,
        );
      default:
        throw new NotFoundException("templateNotFound");
    }
  }

  public getBytecodeByErc998ContractTemplates(dto: IErc998ContractDeployDto, chainId: number) {
    const { contractTemplate } = dto;

    switch (contractTemplate) {
      case Erc998ContractTemplates.BLACKLIST:
        return getContractABI(
          "@framework/core-contracts/artifacts/contracts/ERC998/ERC998Blacklist.sol/ERC998Blacklist.json",
          chainId,
        );
      case Erc998ContractTemplates.ERC20OWNER:
        return getContractABI(
          "@framework/core-contracts/artifacts/contracts/ERC998/ERC998ERC20Simple.sol/ERC998ERC20Simple.json",
          chainId,
        );
      case Erc998ContractTemplates.ERC1155OWNER:
        return getContractABI(
          "@framework/core-contracts/artifacts/contracts/ERC998/ERC998ERC1155Simple.sol/ERC998ERC1155Simple.json",
          chainId,
        );
      case Erc998ContractTemplates.ERC1155OWNER_ERC20OWNER:
        return getContractABI(
          "@framework/core-contracts/artifacts/contracts/ERC998/ERC998ERC1155ERC20.sol/ERC998ERC1155ERC20.json",
          chainId,
        );
      case Erc998ContractTemplates.GENES:
        return getContractABI(
          "@framework/core-contracts/artifacts/contracts/ERC998/traits/ERC998Genes.sol/ERC998Genes.json",
          chainId,
        );
      case Erc998ContractTemplates.RANDOM:
        return getContractABI(
          "@framework/core-contracts/artifacts/contracts/ERC998/ERC998Random.sol/ERC998Random.json",
          chainId,
        );
      case Erc998ContractTemplates.RENTABLE:
        return getContractABI(
          "@framework/core-contracts/artifacts/contracts/ERC998/ERC998Rentable.sol/ERC998Rentable.json",
          chainId,
        );
      case Erc998ContractTemplates.BLACKLIST_RANDOM:
        return getContractABI(
          "@framework/core-contracts/artifacts/contracts/ERC998/random/ERC998BlacklistRandom.sol/ERC998BlacklistRandom.json",
          chainId,
        );
      case Erc998ContractTemplates.SIMPLE:
        return getContractABI(
          "@framework/core-contracts/artifacts/contracts/ERC998/ERC998Simple.sol/ERC998Simple.json",
          chainId,
        );
      case Erc998ContractTemplates.STATEHASH:
        return getContractABI(
          "@framework/core-contracts/artifacts/contracts/ERC998/ERC998StateHash.sol/ERC998StateHash.json",
          chainId,
        );
      case Erc998ContractTemplates.DISCRETE:
        return getContractABI(
          "@framework/core-contracts/artifacts/contracts/ERC998/ERC998Discrete.sol/ERC998Discrete.json",
          chainId,
        );
      case Erc998ContractTemplates.BLACKLIST_DISCRETE:
        return getContractABI(
          "@framework/core-contracts/artifacts/contracts/ERC998/ERC998BlacklistDiscrete.sol/ERC998BlacklistDiscrete.json",
          chainId,
        );
      case Erc998ContractTemplates.DISCRETE_RANDOM:
        return getContractABI(
          "@framework/core-contracts/artifacts/contracts/ERC998/random/ERC998DiscreteRandom.sol/ERC998DiscreteRandom.json",
          chainId,
        );
      case Erc998ContractTemplates.BLACKLIST_DISCRETE_RANDOM:
        return getContractABI(
          "@framework/core-contracts/artifacts/contracts/ERC998/random/ERC998BlacklistDiscreteRandom.sol/ERC998BlacklistDiscreteRandom.json",
          chainId,
        );
      default:
        throw new NotFoundException("templateNotFound");
    }
  }

  public getBytecodeByErc1155ContractTemplates(dto: IErc1155ContractDeployDto, chainId: number) {
    const { contractTemplate } = dto;

    switch (contractTemplate) {
      case Erc1155ContractTemplates.SIMPLE:
        return getContractABI(
          "@framework/core-contracts/artifacts/contracts/ERC1155/ERC1155Simple.sol/ERC1155Simple.json",
          chainId,
        );
      case Erc1155ContractTemplates.BLACKLIST:
        return getContractABI(
          "@framework/core-contracts/artifacts/contracts/ERC1155/ERC1155Blacklist.sol/ERC1155Blacklist.json",
          chainId,
        );
      case Erc1155ContractTemplates.SOULBOUND:
        return getContractABI(
          "@framework/core-contracts/artifacts/contracts/ERC1155/ERC1155Soulbound.sol/ERC1155Soulbound.json",
          chainId,
        );
      default:
        throw new NotFoundException("templateNotFound");
    }
  }

  // MODULE:VESTING
  public getBytecodeByVestingContractTemplate(_dto: IVestingContractDeployDto, chainId: number) {
    return getContractABI(
      "@framework/core-contracts/artifacts/contracts/Mechanics/Vesting/Vesting.sol/Vesting.json",
      chainId,
    );
  }

  // MODULE:MYSTERY
  public getBytecodeByMysteryContractTemplates(dto: IMysteryContractDeployDto, chainId: number) {
    const { contractTemplate } = dto;

    switch (contractTemplate) {
      case MysteryContractTemplates.SIMPLE:
        return getContractABI(
          "@framework/core-contracts/artifacts/contracts/Mechanics/MysteryBox/ERC721MysteryBoxSimple.sol/ERC721MysteryBoxSimple.json",
          chainId,
        );
      case MysteryContractTemplates.PAUSABLE:
        return getContractABI(
          "@framework/core-contracts/artifacts/contracts/Mechanics/MysteryBox/ERC721MysteryBoxPausable.sol/ERC721MysteryBoxPausable.json",
          chainId,
        );
      case MysteryContractTemplates.BLACKLIST:
        return getContractABI(
          "@framework/core-contracts/artifacts/contracts/Mechanics/MysteryBox/ERC721MysteryBoxBlacklist.sol/ERC721MysteryBoxBlacklist.json",
          chainId,
        );
      case MysteryContractTemplates.BLACKLIST_PAUSABLE:
        return getContractABI(
          "@framework/core-contracts/artifacts/contracts/Mechanics/MysteryBox/ERC721MysteryBoxBlacklistPausable.sol/ERC721MysteryBoxBlacklistPausable.json",
          chainId,
        );
      default:
        throw new NotFoundException("templateNotFound");
    }
  }

  // MODULE:COLLECTION
  public getBytecodeByCollectionTemplates(dto: ICollectionContractDeployDto, chainId: number) {
    const { contractTemplate } = dto;

    switch (contractTemplate) {
      case CollectionContractTemplates.SIMPLE:
        return getContractABI(
          "@framework/core-contracts/artifacts/contracts/Mechanics/Collection/ERC721CSimple.sol/ERC721CSimple.json",
          chainId,
        );
      case CollectionContractTemplates.BLACKLIST:
        return getContractABI(
          "@framework/core-contracts/artifacts/contracts/Mechanics/Collection/ERC721CBlacklist.sol/ERC721CBlacklist.json",
          chainId,
        );
      default:
        throw new NotFoundException("templateNotFound");
    }
  }

  // MODULE:STAKING
  public getBytecodeByStakingContractTemplate(dto: IStakingContractDeployDto, chainId: number) {
    const { contractTemplate } = dto;

    switch (contractTemplate) {
      case StakingContractTemplates.SIMPLE:
        return getContractABI(
          "@framework/core-contracts/artifacts/contracts/Mechanics/Staking/Staking.sol/Staking.json",
          chainId,
        );
      default:
        throw new NotFoundException("templateNotFound");
    }
  }

  // MODULE:PYRAMID
  public getBytecodeByPyramidContractTemplate(dto: IPyramidContractDeployDto, chainId: number) {
    const { contractTemplate } = dto;

    switch (contractTemplate) {
      case PyramidContractTemplates.SIMPLE:
        return getContractABI(
          "@framework/core-contracts/artifacts/contracts/Mechanics/Pyramid/PyramidBasic.sol/PyramidBasic.json",
          chainId,
        );
      case PyramidContractTemplates.SPLITTER:
        return getContractABI(
          "@framework/core-contracts/artifacts/contracts/Mechanics/Pyramid/Pyramid.sol/Pyramid.json",
          chainId,
        );
      case PyramidContractTemplates.REFERRAL:
        return getContractABI(
          "@framework/core-contracts/artifacts/contracts/Mechanics/Pyramid/Pyramid.sol/Pyramid.json",
          chainId,
        );
      default:
        throw new NotFoundException("templateNotFound");
    }
  }

  // MODULE:WAITLIST
  public getBytecodeByWaitListContractTemplate(_dto: IWaitListContractDeployDto, chainId: number) {
    return getContractABI(
      "@framework/core-contracts/artifacts/contracts/Mechanics/WaitList/WaitList.sol/WaitList.json",
      chainId,
    );
  }

  // MODULE:RAFFLE
  public getBytecodeByRaffleContractTemplate(chainId: number) {
    return getContractABI(
      "@framework/core-contracts/artifacts/contracts/Mechanics/Raffle/random/RaffleRandom.sol/RaffleRandom.json",
      chainId,
    );
  }

  // MODULE:LOTTERY
  public getBytecodeByLotteryContractTemplate(_dto: ILotteryContractDeployDto, chainId: number) {
    return getContractABI(
      "@framework/core-contracts/artifacts/contracts/Mechanics/Lottery/random/LotteryRandom.sol/LotteryRandom.json",
      chainId,
    );
  }
}
