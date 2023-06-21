import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JsonRpcProvider, Log, Wallet } from "ethers";
import { DeepPartial } from "typeorm";

import type { ILogEvent } from "@gemunion/nestjs-ethers";
import { ETHERS_RPC, ETHERS_SIGNER } from "@gemunion/nestjs-ethers";

import { emptyStateString } from "@gemunion/draft-js-utils";
import { imageUrl, testChainId } from "@framework/constants";
import type {
  IContractManagerCollectionDeployedEvent,
  IContractManagerERC1155TokenDeployedEvent,
  IContractManagerERC20TokenDeployedEvent,
  IContractManagerERC721TokenDeployedEvent,
  IContractManagerERC998TokenDeployedEvent,
  IContractManagerMysteryTokenDeployedEvent,
  IContractManagerPyramidDeployedEvent,
  IContractManagerRaffleDeployedEvent,
  IContractManagerStakingDeployedEvent,
  IContractManagerVestingDeployedEvent,
} from "@framework/types";
import {
  ContractFeatures,
  Erc1155ContractTemplates,
  Erc20ContractTemplates,
  Erc721CollectionTemplates,
  Erc721ContractTemplates,
  Erc998ContractTemplates,
  IContractManagerLotteryDeployedEvent,
  ModuleType,
  MysteryContractTemplates,
  PyramidContractTemplates,
  StakingContractTemplates,
  TemplateStatus,
  TokenType,
} from "@framework/types";

import { UserService } from "../../infrastructure/user/user.service";
import { Erc20LogService } from "../tokens/erc20/token/log/log.service";
import { Erc721TokenLogService } from "../tokens/erc721/token/log/log.service";
import { Erc998TokenLogService } from "../tokens/erc998/token/log/log.service";
import { Erc1155LogService } from "../tokens/erc1155/token/log/log.service";
import { VestingLogService } from "../mechanics/vesting/log/vesting.log.service";
import { ContractService } from "../hierarchy/contract/contract.service";
import { TemplateService } from "../hierarchy/template/template.service";
import { TokenService } from "../hierarchy/token/token.service";
import { GradeService } from "../mechanics/grade/grade.service";
import { MysteryLogService } from "../mechanics/mystery/box/log/log.service";
import { PyramidLogService } from "../mechanics/pyramid/log/log.service";
import { TokenEntity } from "../hierarchy/token/token.entity";
import { BalanceService } from "../hierarchy/balance/balance.service";
import { StakingLogService } from "../mechanics/staking/log/log.service";
import { EventHistoryService } from "../event-history/event-history.service";
import { RentService } from "../mechanics/rent/rent.service";
import { LotteryLogService } from "../mechanics/lottery/log/log.service";
import { RaffleLogService } from "../mechanics/raffle/log/log.service";
import { Erc721TokenRandomLogService } from "../tokens/erc721/token/log-random/log.service";
import { Erc998TokenRandomLogService } from "../tokens/erc998/token/log-random/log.service";
import { addConsumer } from "../integrations/chain-link/utils";

@Injectable()
export class ContractManagerServiceEth {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    @Inject(ETHERS_SIGNER)
    protected readonly ethersSignerProvider: Wallet,
    @Inject(ETHERS_RPC)
    protected readonly jsonRpcProvider: JsonRpcProvider,
    private readonly configService: ConfigService,
    private readonly eventHistoryService: EventHistoryService,
    private readonly contractService: ContractService,
    private readonly erc20LogService: Erc20LogService,
    private readonly erc721LogService: Erc721TokenLogService,
    private readonly erc721RandomLogService: Erc721TokenRandomLogService,
    private readonly erc998LogService: Erc998TokenLogService,
    private readonly erc998RandomLogService: Erc998TokenRandomLogService,
    private readonly erc1155LogService: Erc1155LogService,
    private readonly vestingLogService: VestingLogService,
    private readonly stakingLogService: StakingLogService,
    private readonly mysteryLogService: MysteryLogService,
    private readonly pyramidLogService: PyramidLogService,
    private readonly lotteryLogService: LotteryLogService,
    private readonly raffleLogService: RaffleLogService,
    private readonly templateService: TemplateService,
    private readonly tokenService: TokenService,
    private readonly gradeService: GradeService,
    private readonly rentService: RentService,
    private readonly balanceService: BalanceService,
    private readonly userService: UserService,
  ) {}

  public async erc20Token(event: ILogEvent<IContractManagerERC20TokenDeployedEvent>, ctx: Log): Promise<void> {
    const {
      args: { account, args, externalId },
    } = event;

    const { name, symbol, cap, contractTemplate } = args;

    await this.eventHistoryService.updateHistory(event, ctx);

    const chainId = ~~this.configService.get<number>("CHAIN_ID", Number(testChainId));

    const erc20ContractEntity = await this.contractService.create({
      address: account.toLowerCase(),
      title: name,
      name,
      symbol,
      decimals: 18,
      description: emptyStateString,
      imageUrl,
      contractFeatures:
        contractTemplate === "0"
          ? []
          : (Object.values(Erc20ContractTemplates)[Number(contractTemplate)].split("_") as Array<ContractFeatures>),
      contractType: TokenType.ERC20,
      chainId,
      fromBlock: parseInt(ctx.blockNumber.toString(), 16),
      merchantId: await this.getMerchantId(externalId),
    });

    const templateEntity = await this.templateService.create({
      title: name,
      description: emptyStateString,
      imageUrl,
      cap,
      contractId: erc20ContractEntity.id,
    });

    await this.tokenService.create({
      metadata: "{}",
      tokenId: "0",
      royalty: 0,
      template: templateEntity,
    });

    this.erc20LogService.addListener({
      address: [account.toLowerCase()],
      fromBlock: parseInt(ctx.blockNumber.toString(), 16),
    });
  }

  public async erc721Token(event: ILogEvent<IContractManagerERC721TokenDeployedEvent>, ctx: Log): Promise<void> {
    const {
      args: { account, args, externalId },
    } = event;

    const { name, symbol, royalty, baseTokenURI, contractTemplate } = args;

    await this.eventHistoryService.updateHistory(event, ctx);

    const chainId = ~~this.configService.get<number>("CHAIN_ID", Number(testChainId));

    const contractEntity = await this.contractService.create({
      address: account.toLowerCase(),
      title: name,
      name,
      symbol,
      description: emptyStateString,
      imageUrl,
      contractFeatures:
        contractTemplate === "0"
          ? []
          : (Object.values(Erc721ContractTemplates)[Number(contractTemplate)].split("_") as Array<ContractFeatures>),
      contractType: TokenType.ERC721,
      chainId,
      royalty: Number(royalty),
      baseTokenURI,
      fromBlock: parseInt(ctx.blockNumber.toString(), 16),
      merchantId: await this.getMerchantId(externalId),
    });

    if (contractEntity.contractFeatures.includes(ContractFeatures.RANDOM)) {
      const vrfAddr = this.configService.get<string>("VRF_ADDR", "");
      const subscriptionId = this.configService.get<string>("CHAINLINK_SUBSCRIPTION_ID", "1");
      const txr: string = await addConsumer(
        vrfAddr,
        ~~subscriptionId,
        account.toLowerCase(),
        this.ethersSignerProvider,
      );
      this.loggerService.log(JSON.stringify(`addConsumer ${txr}`, null, "\t"), ContractManagerServiceEth.name);
    }

    if (contractEntity.contractFeatures.includes(ContractFeatures.UPGRADEABLE)) {
      await this.gradeService.create({ contract: contractEntity });
    }

    if (contractEntity.contractFeatures.includes(ContractFeatures.RENTABLE)) {
      await this.rentService.create({ contract: contractEntity }, chainId);
    }

    if (contractEntity.contractFeatures.includes(ContractFeatures.GENES)) {
      await this.templateService.create({
        title: name,
        description: emptyStateString,
        imageUrl,
        cap: (1024 * 1024 * 1024 * 4).toString(),
        contractId: contractEntity.id,
        templateStatus: TemplateStatus.HIDDEN,
      });
    }

    if (
      contractEntity.contractFeatures.includes(ContractFeatures.RANDOM) ||
      contractEntity.contractFeatures.includes(ContractFeatures.GENES)
    ) {
      this.erc721RandomLogService.addListener({
        address: [account.toLowerCase()],
        fromBlock: parseInt(ctx.blockNumber.toString(), 16),
      });
    } else {
      this.erc721LogService.addListener({
        address: [account.toLowerCase()],
        fromBlock: parseInt(ctx.blockNumber.toString(), 16),
      });
    }
  }

  public async erc721Collection(event: ILogEvent<IContractManagerCollectionDeployedEvent>, ctx: Log): Promise<void> {
    const {
      args: { account, args, externalId },
    } = event;

    const { name, symbol, royalty, baseTokenURI, batchSize, contractTemplate } = args;

    await this.eventHistoryService.updateHistory(event, ctx);

    const chainId = ~~this.configService.get<number>("CHAIN_ID", Number(testChainId));

    const contractEntity = await this.contractService.create({
      address: account.toLowerCase(),
      title: name,
      name,
      symbol,
      description: emptyStateString,
      parameters: {
        batchSize,
      },
      imageUrl,
      contractFeatures:
        contractTemplate === "0"
          ? []
          : (Object.values(Erc721CollectionTemplates)[Number(contractTemplate)].split("_") as Array<ContractFeatures>),
      contractType: TokenType.ERC721,
      contractModule: ModuleType.COLLECTION,
      chainId,
      royalty: Number(royalty),
      baseTokenURI,
      fromBlock: parseInt(ctx.blockNumber.toString(), 16),
      merchantId: await this.getMerchantId(externalId),
    });

    const templateEntity = await this.templateService.createTemplate({
      title: name,
      description: emptyStateString,
      imageUrl,
      cap: batchSize.toString(),
      contractId: contractEntity.id,
      templateStatus: TemplateStatus.INACTIVE,
    });

    // TODO add options to set naming scheme ?
    const imgUrl = this.configService.get<string>("TOKEN_IMG_URL", "");

    const currentDateTime = new Date().toISOString();
    const tokenArray: Array<DeepPartial<TokenEntity>> = [...Array(Number(batchSize))].map((_, i) => ({
      metadata: "{}",
      tokenId: i.toString(),
      royalty: Number(royalty),
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      imageUrl: `${imgUrl}/collection/${account.toLowerCase()}/${i}.jpg`,
      template: templateEntity,
      createdAt: currentDateTime,
      updatedAt: currentDateTime,
    }));

    const entityArray = await this.tokenService.createBatch(tokenArray);

    await this.createBalancesBatch(externalId, entityArray);

    this.erc721LogService.addListener({
      address: [account.toLowerCase()],
      fromBlock: parseInt(ctx.blockNumber.toString(), 16),
    });
  }

  public async erc998Token(event: ILogEvent<IContractManagerERC998TokenDeployedEvent>, ctx: Log): Promise<void> {
    const {
      args: { account, args, externalId },
    } = event;

    const { name, symbol, royalty, baseTokenURI, contractTemplate } = args;

    await this.eventHistoryService.updateHistory(event, ctx);

    const chainId = ~~this.configService.get<number>("CHAIN_ID", Number(testChainId));

    const contractEntity = await this.contractService.create({
      address: account.toLowerCase(),
      title: name,
      name,
      symbol,
      description: emptyStateString,
      imageUrl,
      contractFeatures:
        contractTemplate === "0"
          ? []
          : (Object.values(Erc998ContractTemplates)[Number(contractTemplate)].split("_") as Array<ContractFeatures>),
      contractType: TokenType.ERC998,
      chainId,
      royalty: Number(royalty),
      baseTokenURI,
      fromBlock: parseInt(ctx.blockNumber.toString(), 16),
      merchantId: await this.getMerchantId(externalId),
    });

    if (contractEntity.contractFeatures.includes(ContractFeatures.RANDOM)) {
      const vrfAddr = this.configService.get<string>("VRF_ADDR", "");
      const subscriptionId = this.configService.get<string>("CHAINLINK_SUBSCRIPTION_ID", "1");
      const txr: string = await addConsumer(
        vrfAddr,
        ~~subscriptionId,
        account.toLowerCase(),
        this.ethersSignerProvider,
      );
      this.loggerService.log(JSON.stringify(`addConsumer ${txr}`, null, "\t"), ContractManagerServiceEth.name);
    }

    if (contractEntity.contractFeatures.includes(ContractFeatures.UPGRADEABLE)) {
      await this.gradeService.create({ contract: contractEntity });
    }

    if (contractEntity.contractFeatures.includes(ContractFeatures.GENES)) {
      await this.templateService.create({
        title: name,
        description: emptyStateString,
        imageUrl,
        cap: (1024 * 1024 * 1024 * 4).toString(),
        contractId: contractEntity.id,
        templateStatus: TemplateStatus.HIDDEN,
      });
    }

    if (
      contractEntity.contractFeatures.includes(ContractFeatures.RANDOM) ||
      contractEntity.contractFeatures.includes(ContractFeatures.GENES)
    ) {
      this.erc998RandomLogService.addListener({
        address: [account.toLowerCase()],
        fromBlock: parseInt(ctx.blockNumber.toString(), 16),
      });
    } else {
      this.erc998LogService.addListener({
        address: [account.toLowerCase()],
        fromBlock: parseInt(ctx.blockNumber.toString(), 16),
      });
    }
  }
  //

  public async erc1155Token(event: ILogEvent<IContractManagerERC1155TokenDeployedEvent>, ctx: Log): Promise<void> {
    const {
      args: { account, args, externalId },
    } = event;

    const { royalty, baseTokenURI, contractTemplate } = args;

    await this.eventHistoryService.updateHistory(event, ctx);

    const chainId = ~~this.configService.get<number>("CHAIN_ID", Number(testChainId));

    await this.contractService.create({
      address: account.toLowerCase(),
      title: `${TokenType.ERC1155} (new)`,
      description: emptyStateString,
      imageUrl,
      baseTokenURI,
      contractFeatures:
        contractTemplate === "0"
          ? []
          : (Object.values(Erc1155ContractTemplates)[Number(contractTemplate)].split("_") as Array<ContractFeatures>),
      contractType: TokenType.ERC1155,
      chainId,
      royalty: Number(royalty),
      fromBlock: parseInt(ctx.blockNumber.toString(), 16),
      merchantId: await this.getMerchantId(externalId),
    });

    this.erc1155LogService.addListener({
      address: [account.toLowerCase()],
      fromBlock: parseInt(ctx.blockNumber.toString(), 16),
    });
  }

  public async mysteryBox(event: ILogEvent<IContractManagerMysteryTokenDeployedEvent>, ctx: Log): Promise<void> {
    const {
      args: { account, args, externalId },
    } = event;

    const { name, symbol, baseTokenURI, royalty, contractTemplate } = args;

    await this.eventHistoryService.updateHistory(event, ctx);

    const chainId = ~~this.configService.get<number>("CHAIN_ID", Number(testChainId));

    await this.contractService.create({
      address: account.toLowerCase(),
      title: name,
      name,
      symbol,
      description: emptyStateString,
      imageUrl,
      contractFeatures:
        contractTemplate === "0"
          ? []
          : (Object.values(MysteryContractTemplates)[Number(contractTemplate)].split("_") as Array<ContractFeatures>),
      contractType: TokenType.ERC721,
      contractModule: ModuleType.MYSTERY,
      chainId,
      royalty: Number(royalty),
      baseTokenURI,
      fromBlock: parseInt(ctx.blockNumber.toString(), 16),
      merchantId: await this.getMerchantId(externalId),
    });

    this.mysteryLogService.addListener({
      address: [account.toLowerCase()],
      fromBlock: parseInt(ctx.blockNumber.toString(), 16),
    });
  }

  public async vesting(event: ILogEvent<IContractManagerVestingDeployedEvent>, ctx: Log): Promise<void> {
    const {
      args: { account, args, externalId },
    } = event;

    const { beneficiary, startTimestamp, cliffInMonth, monthlyRelease } = args;

    await this.eventHistoryService.updateHistory(event, ctx);

    const chainId = ~~this.configService.get<number>("CHAIN_ID", Number(testChainId));

    await this.contractService.create({
      address: account.toLowerCase(),
      title: "Vesting",
      description: emptyStateString,
      imageUrl,
      parameters: {
        beneficiary: beneficiary.toLowerCase(),
        startTimestamp: new Date(Number(startTimestamp) * 1000).toISOString(),
        cliffInMonth,
        monthlyRelease,
      },
      contractFeatures: [],
      contractModule: ModuleType.VESTING,
      chainId,
      fromBlock: parseInt(ctx.blockNumber.toString(), 16),
      merchantId: await this.getMerchantId(externalId),
    });

    this.vestingLogService.addListener({
      address: [account.toLowerCase()],
      fromBlock: parseInt(ctx.blockNumber.toString(), 16),
    });
  }

  public async pyramid(event: ILogEvent<IContractManagerPyramidDeployedEvent>, ctx: Log): Promise<void> {
    const {
      args: { account, args, externalId },
    } = event;
    const { payees, shares, contractTemplate } = args;

    await this.eventHistoryService.updateHistory(event, ctx);

    const chainId = ~~this.configService.get<number>("CHAIN_ID", Number(testChainId));

    await this.contractService.create({
      address: account.toLowerCase(),
      title: `${ModuleType.PYRAMID} (new)`,
      description: emptyStateString,
      parameters: {
        payees: payees.toString(),
        shares: shares.toString(),
      },
      imageUrl,
      contractFeatures:
        contractTemplate === "0"
          ? []
          : (Object.values(PyramidContractTemplates)[Number(contractTemplate)].split("_") as Array<ContractFeatures>),
      contractModule: ModuleType.PYRAMID,
      chainId,
      fromBlock: parseInt(ctx.blockNumber.toString(), 16),
      merchantId: await this.getMerchantId(externalId),
    });

    this.pyramidLogService.addListener({
      address: [account.toLowerCase()],
      fromBlock: parseInt(ctx.blockNumber.toString(), 16),
    });
  }

  public async lottery(event: ILogEvent<IContractManagerLotteryDeployedEvent>, ctx: Log): Promise<void> {
    const {
      args: { account, args, externalId },
    } = event;

    const { config } = args;
    const { timeLagBeforeRelease, commission } = config;

    await this.eventHistoryService.updateHistory(event, ctx);

    const chainId = ~~this.configService.get<number>("CHAIN_ID", Number(testChainId));

    await this.contractService.create({
      address: account.toLowerCase(),
      title: `${ModuleType.LOTTERY} (new)`,
      description: emptyStateString,
      parameters: {
        timeLagBeforeRelease,
        commission,
      },
      imageUrl,
      contractFeatures: [ContractFeatures.RANDOM],
      contractModule: ModuleType.LOTTERY,
      chainId,
      fromBlock: parseInt(ctx.blockNumber.toString(), 16),
      merchantId: await this.getMerchantId(externalId),
    });

    const vrfAddr = this.configService.get<string>("VRF_ADDR", "");
    const subscriptionId = this.configService.get<string>("CHAINLINK_SUBSCRIPTION_ID", "1");
    const txr: string = await addConsumer(vrfAddr, ~~subscriptionId, account.toLowerCase(), this.ethersSignerProvider);
    this.loggerService.log(JSON.stringify(`addConsumer ${txr}`, null, "\t"), ContractManagerServiceEth.name);

    this.lotteryLogService.addListener({
      address: [account.toLowerCase()],
      fromBlock: parseInt(ctx.blockNumber.toString(), 16),
    });
  }

  public async raffle(event: ILogEvent<IContractManagerRaffleDeployedEvent>, ctx: Log): Promise<void> {
    const {
      args: { account, args, externalId },
    } = event;

    const { config } = args;
    const { timeLagBeforeRelease, commission } = config;

    await this.eventHistoryService.updateHistory(event, ctx);

    const chainId = ~~this.configService.get<number>("CHAIN_ID", Number(testChainId));

    await this.contractService.create({
      address: account.toLowerCase(),
      title: `${ModuleType.RAFFLE} (new)`,
      description: emptyStateString,
      parameters: {
        timeLagBeforeRelease,
        commission,
      },
      imageUrl,
      contractFeatures: [ContractFeatures.RANDOM],
      contractModule: ModuleType.LOTTERY,
      chainId,
      fromBlock: parseInt(ctx.blockNumber.toString(), 16),
      merchantId: await this.getMerchantId(externalId),
    });

    const vrfAddr = this.configService.get<string>("VRF_ADDR", "");
    const subscriptionId = this.configService.get<string>("CHAINLINK_SUBSCRIPTION_ID", "1");
    const txr: string = await addConsumer(vrfAddr, ~~subscriptionId, account.toLowerCase(), this.ethersSignerProvider);
    this.loggerService.log(JSON.stringify(`addConsumer ${txr}`, null, "\t"), ContractManagerServiceEth.name);

    this.raffleLogService.addListener({
      address: [account.toLowerCase()],
      fromBlock: parseInt(ctx.blockNumber.toString(), 16),
    });
  }

  public async staking(event: ILogEvent<IContractManagerStakingDeployedEvent>, ctx: Log): Promise<void> {
    const {
      args: { account, args, externalId },
    } = event;

    const { contractTemplate } = args;

    await this.eventHistoryService.updateHistory(event, ctx);

    const chainId = ~~this.configService.get<number>("CHAIN_ID", Number(testChainId));

    await this.contractService.create({
      address: account.toLowerCase(),
      title: `${ModuleType.STAKING} (new)`,
      description: emptyStateString,
      imageUrl,
      contractFeatures:
        contractTemplate === "0"
          ? []
          : (Object.values(StakingContractTemplates)[Number(contractTemplate)].split("_") as Array<ContractFeatures>),
      contractModule: ModuleType.STAKING,
      chainId,
      fromBlock: parseInt(ctx.blockNumber.toString(), 16),
      merchantId: await this.getMerchantId(externalId),
    });

    this.stakingLogService.addListener({
      address: [account.toLowerCase()],
      fromBlock: parseInt(ctx.blockNumber.toString(), 16),
    });
  }

  private async createBalancesBatch(externalId: number, tokenArray: Array<TokenEntity>) {
    const currentDateTime = new Date().toISOString();

    const userEntity = await this.userService.findOne({ id: externalId });
    if (!userEntity) {
      this.loggerService.error("CRITICAL ERROR", GradeService.name);
      throw new NotFoundException("userNotFound");
    }

    await this.balanceService.createBatch(
      new Array(tokenArray.length).fill(null).map((_, i) => ({
        account: userEntity.wallet.toLowerCase(),
        amount: "1",
        tokenId: tokenArray[i].id,
        createdAt: currentDateTime,
        updatedAt: currentDateTime,
      })),
    );
  }

  public async getMerchantId(externalId: number): Promise<number> {
    const userEntity = await this.userService.findOne({ id: externalId });
    if (!userEntity) {
      this.loggerService.error("CRITICAL ERROR", GradeService.name);
      throw new NotFoundException("userNotFound");
    }
    return userEntity.merchantId;
  }
}
