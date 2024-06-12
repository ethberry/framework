import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { ConfigService } from "@nestjs/config";
import { JsonRpcProvider, Log, Wallet } from "ethers";
import { DeepPartial } from "typeorm";

import type { ILogEvent } from "@gemunion/nest-js-module-ethers-gcp";
import { ETHERS_RPC, ETHERS_SIGNER } from "@gemunion/nest-js-module-ethers-gcp";

import { emptyStateString } from "@gemunion/draft-js-utils";
import { imageUrl, testChainId } from "@framework/constants";
import type {
  IContractManagerCollectionDeployedEvent,
  IContractManagerERC1155TokenDeployedEvent,
  IContractManagerERC20TokenDeployedEvent,
  IContractManagerERC721TokenDeployedEvent,
  IContractManagerERC998TokenDeployedEvent,
  IContractManagerLotteryDeployedEvent,
  IContractManagerMysteryTokenDeployedEvent,
  IContractManagerLootTokenDeployedEvent,
  IContractManagerPonziDeployedEvent,
  IContractManagerRaffleDeployedEvent,
  IContractManagerStakingDeployedEvent,
  IContractManagerVestingDeployedEvent,
  IContractManagerWaitListDeployedEvent,
} from "@framework/types";
import {
  CollectionContractTemplates,
  ContractFeatures,
  ContractSecurity,
  ContractStatus,
  Erc1155ContractTemplates,
  Erc20ContractTemplates,
  Erc721ContractTemplates,
  Erc998ContractTemplates,
  IContractManagerPaymentSplitterDeployedEvent,
  ModuleType,
  MysteryContractTemplates,
  LootContractTemplates,
  RmqProviderType,
  SignalEventType,
  // StakingContractFeatures,
  // StakingContractTemplates,
  TemplateStatus,
  TokenType,
} from "@framework/types";

import { UserService } from "../../infrastructure/user/user.service";
import { Erc20LogService } from "../tokens/erc20/token/log/log.service";
import { Erc721LogService } from "../tokens/erc721/token/log/log.service";
import { Erc998LogService } from "../tokens/erc998/token/log/log.service";
import { Erc1155LogService } from "../tokens/erc1155/token/log/log.service";
import { VestingLogService } from "../mechanics/marketing/vesting/log/vesting.log.service";
import { ContractService } from "../hierarchy/contract/contract.service";
import { TemplateService } from "../hierarchy/template/template.service";
import { TokenService } from "../hierarchy/token/token.service";
import { MysteryLogService } from "../mechanics/marketing/mystery/box/log/log.service";
import { PonziLogService } from "../mechanics/gambling/ponzi/log/log.service";
import { TokenEntity } from "../hierarchy/token/token.entity";
import { BalanceService } from "../hierarchy/balance/balance.service";
import { StakingLogService } from "../mechanics/marketing/staking/log/log.service";
import { EventHistoryService } from "../event-history/event-history.service";
import { RentService } from "../mechanics/gaming/rent/rent.service";
import { LotteryLogService } from "../mechanics/gambling/lottery/log/log.service";
import { RaffleLogService } from "../mechanics/gambling/raffle/log/log.service";
import { Erc721TokenRandomLogService } from "../tokens/erc721/token/log-random/log.service";
import { Erc998TokenRandomLogService } from "../tokens/erc998/token/log-random/log.service";
import { LotteryTicketLogService } from "../mechanics/gambling/lottery/ticket/log/log.service";
import { RaffleTicketLogService } from "../mechanics/gambling/raffle/ticket/log/log.service";
import { ClaimService } from "../mechanics/marketing/claim/claim.service";
import { ChainLinkLogService } from "../integrations/chain-link/contract/log/log.service";
import { WaitListLogService } from "../mechanics/marketing/wait-list/log/log.service";
import { decodeExternalId } from "../../common/utils";
import { PaymentSplitterLogService } from "../mechanics/meta/payment-splitter/log/log.service";
import { LootLogService } from "../mechanics/marketing/loot/box/log/log.service";

@Injectable()
export class ContractManagerServiceEth {
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    @Inject(ETHERS_SIGNER)
    protected readonly ethersSignerProvider: Wallet,
    @Inject(ETHERS_RPC)
    protected readonly jsonRpcProvider: JsonRpcProvider,
    @Inject(RmqProviderType.SIGNAL_SERVICE)
    protected readonly signalClientProxy: ClientProxy,
    private readonly configService: ConfigService,
    private readonly eventHistoryService: EventHistoryService,
    private readonly contractService: ContractService,
    private readonly erc20LogService: Erc20LogService,
    private readonly erc721LogService: Erc721LogService,
    private readonly erc721RandomLogService: Erc721TokenRandomLogService,
    private readonly erc998LogService: Erc998LogService,
    private readonly erc998RandomLogService: Erc998TokenRandomLogService,
    private readonly erc1155LogService: Erc1155LogService,
    private readonly vestingLogService: VestingLogService,
    private readonly stakingLogService: StakingLogService,
    private readonly mysteryLogService: MysteryLogService,
    private readonly lootLogService: LootLogService,
    private readonly ponziLogService: PonziLogService,
    private readonly paymentSplitterLogService: PaymentSplitterLogService,
    private readonly lotteryLogService: LotteryLogService,
    private readonly lotteryTicketLogService: LotteryTicketLogService,
    private readonly raffleLogService: RaffleLogService,
    private readonly waitListLogService: WaitListLogService,
    private readonly raffleTicketLogService: RaffleTicketLogService,
    private readonly templateService: TemplateService,
    private readonly tokenService: TokenService,
    private readonly rentService: RentService,
    private readonly balanceService: BalanceService,
    private readonly userService: UserService,
    private readonly claimService: ClaimService,
    private readonly chainLinkLogService: ChainLinkLogService,
  ) {}

  public async erc20Token(event: ILogEvent<IContractManagerERC20TokenDeployedEvent>, context: Log): Promise<void> {
    const {
      args: { account, args, externalId },
    } = event;
    const { transactionHash } = context;

    const { name, symbol, cap, contractTemplate } = args;

    await this.eventHistoryService.updateHistory(event, context);

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
      fromBlock: parseInt(context.blockNumber.toString(), 16),
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
      fromBlock: parseInt(context.blockNumber.toString(), 16),
    });

    await this.signalClientProxy
      .emit(SignalEventType.TRANSACTION_HASH, {
        account: await this.getUserWalletById(externalId),
        transactionHash,
        transactionType: event.name,
      })
      .toPromise();
  }

  public async erc721Token(event: ILogEvent<IContractManagerERC721TokenDeployedEvent>, context: Log): Promise<void> {
    const {
      args: { account, args, externalId },
    } = event;
    const { transactionHash } = context;

    const { name, symbol, royalty, baseTokenURI, contractTemplate } = args;

    await this.eventHistoryService.updateHistory(event, context);

    const chainId = ~~this.configService.get<number>("CHAIN_ID", Number(testChainId));

    const { contractFeatures, contractModule } = this.parseErc721Template(contractTemplate);

    const contractEntity = await this.contractService.create({
      address: account.toLowerCase(),
      title: name,
      name,
      symbol,
      description: emptyStateString,
      imageUrl,
      contractFeatures,
      contractType: TokenType.ERC721,
      contractModule,
      chainId,
      royalty: Number(royalty),
      baseTokenURI,
      fromBlock: parseInt(context.blockNumber.toString(), 16),
      merchantId: await this.getMerchantId(externalId),
    });

    if (contractEntity.contractFeatures.includes(ContractFeatures.RANDOM)) {
      await this.chainLinkLogService.updateListener();
      // TODO probably update listener only after set subscription by admin etc..
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

    if (contractEntity.contractModule === ModuleType.LOTTERY || contractEntity.contractModule === ModuleType.RAFFLE) {
      // CREATE TEMPLATE TICKET
      await this.templateService.create({
        title: name,
        description: emptyStateString,
        imageUrl,
        contractId: contractEntity.id,
        templateStatus: TemplateStatus.ACTIVE,
      });
    }

    if (
      contractEntity.contractFeatures.includes(ContractFeatures.RANDOM) ||
      contractEntity.contractFeatures.includes(ContractFeatures.GENES)
    ) {
      this.erc721RandomLogService.addListener({
        address: [account.toLowerCase()],
        fromBlock: parseInt(context.blockNumber.toString(), 16),
      });
    } else if (contractEntity.contractModule === ModuleType.LOTTERY) {
      this.lotteryTicketLogService.addListener({
        address: [account.toLowerCase()],
        fromBlock: parseInt(context.blockNumber.toString(), 16),
      });
    } else if (contractEntity.contractModule === ModuleType.RAFFLE) {
      // ADD LISTENER
      this.raffleTicketLogService.addListener({
        address: [account.toLowerCase()],
        fromBlock: parseInt(context.blockNumber.toString(), 16),
      });
    } else {
      this.erc721LogService.addListener({
        address: [account.toLowerCase()],
        fromBlock: parseInt(context.blockNumber.toString(), 16),
      });
    }

    await this.signalClientProxy
      .emit(SignalEventType.TRANSACTION_HASH, {
        account: await this.getUserWalletById(externalId),
        transactionHash,
        transactionType: event.name,
      })
      .toPromise();
  }

  public async erc721Collection(
    event: ILogEvent<IContractManagerCollectionDeployedEvent>,
    context: Log,
  ): Promise<void> {
    const {
      args: { account, args, externalId },
    } = event;
    const { transactionHash } = context;

    const { name, symbol, royalty, baseTokenURI, batchSize, contractTemplate } = args;

    await this.eventHistoryService.updateHistory(event, context);

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
          : (Object.values(CollectionContractTemplates)[Number(contractTemplate)].split(
              "_",
            ) as Array<ContractFeatures>),
      contractType: TokenType.ERC721,
      contractModule: ModuleType.COLLECTION,
      chainId,
      royalty: Number(royalty),
      baseTokenURI,
      fromBlock: parseInt(context.blockNumber.toString(), 16),
      merchantId: await this.getMerchantId(externalId),
    });

    const templateEntity = await this.templateService.createTemplate({
      title: name,
      description: emptyStateString,
      imageUrl,
      cap: batchSize.toString(),
      contractId: contractEntity.id,
      templateStatus: TemplateStatus.HIDDEN,
    });

    const imgUrl = this.configService.get<string>("TOKEN_IMG_URL", `${baseTokenURI}`);

    const currentDateTime = new Date().toISOString();
    const tokenArray: Array<DeepPartial<TokenEntity>> = [...Array(Number(batchSize))].map((_, i) => ({
      metadata: "{}",
      tokenId: i.toString(),
      royalty: Number(royalty),
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      // $url/collection/$account/$index.jpg
      imageUrl: `${imgUrl}/${account.toLowerCase()}/${i}.jpg`,
      template: templateEntity,
      createdAt: currentDateTime,
      updatedAt: currentDateTime,
    }));

    const entityArray = await this.tokenService.createBatch(tokenArray);

    await this.createBalancesBatch(externalId, entityArray);

    this.erc721LogService.addListener({
      address: [account.toLowerCase()],
      fromBlock: parseInt(context.blockNumber.toString(), 16),
    });

    await this.signalClientProxy
      .emit(SignalEventType.TRANSACTION_HASH, {
        account: await this.getUserWalletById(externalId),
        transactionHash,
        transactionType: event.name,
      })
      .toPromise();
  }

  public async erc998Token(event: ILogEvent<IContractManagerERC998TokenDeployedEvent>, context: Log): Promise<void> {
    const {
      args: { account, args, externalId },
    } = event;
    const { transactionHash } = context;

    const { name, symbol, royalty, baseTokenURI, contractTemplate } = args;

    await this.eventHistoryService.updateHistory(event, context);

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
      fromBlock: parseInt(context.blockNumber.toString(), 16),
      merchantId: await this.getMerchantId(externalId),
    });

    if (contractEntity.contractFeatures.includes(ContractFeatures.RANDOM)) {
      await this.chainLinkLogService.updateListener();
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
        fromBlock: parseInt(context.blockNumber.toString(), 16),
      });
    } else {
      this.erc998LogService.addListener({
        address: [account.toLowerCase()],
        fromBlock: parseInt(context.blockNumber.toString(), 16),
      });
    }

    await this.signalClientProxy
      .emit(SignalEventType.TRANSACTION_HASH, {
        account: await this.getUserWalletById(externalId),
        transactionHash,
        transactionType: event.name,
      })
      .toPromise();
  }

  public async erc1155Token(event: ILogEvent<IContractManagerERC1155TokenDeployedEvent>, context: Log): Promise<void> {
    const {
      name,
      args: { account, args, externalId },
    } = event;
    const { transactionHash } = context;

    const { royalty, baseTokenURI, contractTemplate } = args;

    await this.eventHistoryService.updateHistory(event, context);

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
      fromBlock: parseInt(context.blockNumber.toString(), 16),
      merchantId: await this.getMerchantId(externalId),
    });

    this.erc1155LogService.addListener({
      address: [account.toLowerCase()],
      fromBlock: parseInt(context.blockNumber.toString(), 16),
    });

    await this.signalClientProxy
      .emit(SignalEventType.TRANSACTION_HASH, {
        account: await this.getUserWalletById(externalId),
        transactionHash,
        transactionType: name,
      })
      .toPromise();
  }

  public async mysteryBox(event: ILogEvent<IContractManagerMysteryTokenDeployedEvent>, context: Log): Promise<void> {
    const {
      args: { account, args, externalId },
    } = event;
    const { transactionHash } = context;

    const { name, symbol, baseTokenURI, royalty, contractTemplate } = args;

    await this.eventHistoryService.updateHistory(event, context);

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
      fromBlock: parseInt(context.blockNumber.toString(), 16),
      merchantId: await this.getMerchantId(externalId),
    });

    this.mysteryLogService.addListener({
      address: [account.toLowerCase()],
      fromBlock: parseInt(context.blockNumber.toString(), 16),
    });

    await this.signalClientProxy
      .emit(SignalEventType.TRANSACTION_HASH, {
        account: await this.getUserWalletById(externalId),
        transactionHash,
        transactionType: event.name,
      })
      .toPromise();
  }

  public async lootBox(event: ILogEvent<IContractManagerLootTokenDeployedEvent>, context: Log): Promise<void> {
    const {
      args: { account, args, externalId },
    } = event;
    const { transactionHash } = context;

    const { name, symbol, baseTokenURI, royalty, contractTemplate } = args;

    await this.eventHistoryService.updateHistory(event, context);

    const chainId = ~~this.configService.get<number>("CHAIN_ID", Number(testChainId));
    const contractFeatures =
      contractTemplate === "0"
        ? []
        : (Object.values(LootContractTemplates)[Number(contractTemplate)].split("_") as Array<ContractFeatures>);

    await this.contractService.create({
      address: account.toLowerCase(),
      title: name,
      name,
      symbol,
      description: emptyStateString,
      imageUrl,
      contractFeatures: [ContractFeatures.ALLOWANCE, ...contractFeatures],
      contractType: TokenType.ERC721,
      contractModule: ModuleType.LOOT,
      chainId,
      royalty: Number(royalty),
      baseTokenURI,
      fromBlock: parseInt(context.blockNumber.toString(), 16),
      merchantId: await this.getMerchantId(externalId),
    });

    this.lootLogService.addListener({
      address: [account.toLowerCase()],
      fromBlock: parseInt(context.blockNumber.toString(), 16),
    });

    await this.signalClientProxy
      .emit(SignalEventType.TRANSACTION_HASH, {
        account: await this.getUserWalletById(externalId),
        transactionHash,
        transactionType: event.name,
      })
      .toPromise();
  }

  public async vesting(event: ILogEvent<IContractManagerVestingDeployedEvent>, context: Log): Promise<void> {
    const {
      name,
      args: { account, args, externalId /* <-- userId + claimId */ },
    } = event;
    const { transactionHash } = context;

    const decodedExternalId: Record<string, number> = decodeExternalId(BigInt(externalId), ["userId", "claimId"]);

    const { userId, claimId } = decodedExternalId;

    const { owner, startTimestamp, cliffInMonth, monthlyRelease, contractTemplate } = args;

    await this.eventHistoryService.updateHistory(event, context);

    const chainId = ~~this.configService.get<number>("CHAIN_ID", Number(testChainId));

    const contractFeatures = contractTemplate === "1" ? [ContractFeatures.VOTES] : [];

    await this.contractService.create({
      address: account.toLowerCase(),
      title: "Vesting",
      description: emptyStateString,
      imageUrl,
      parameters: {
        account: owner.toLowerCase(),
        startTimestamp: new Date(Number(startTimestamp) * 1000).toISOString(),
        cliffInMonth,
        monthlyRelease,
      },
      contractFeatures,
      contractModule: ModuleType.VESTING,
      contractSecurity: ContractSecurity.OWNABLE,
      chainId,
      fromBlock: parseInt(context.blockNumber.toString(), 16),
      merchantId: await this.getMerchantId(userId),
    });

    if (claimId && claimId > 0) {
      await this.claimService.redeemClaim(claimId);
    }

    this.vestingLogService.addListener({
      address: [account.toLowerCase()],
      fromBlock: parseInt(context.blockNumber.toString(), 16),
    });

    await this.signalClientProxy
      .emit(SignalEventType.TRANSACTION_HASH, {
        account: await this.getUserWalletById(userId),
        transactionHash,
        transactionType: name,
      })
      .toPromise();
  }

  public async ponzi(event: ILogEvent<IContractManagerPonziDeployedEvent>, context: Log): Promise<void> {
    const {
      name,
      args: { account, args, externalId },
    } = event;
    const { transactionHash } = context;

    const { payees, shares, contractTemplate } = args;

    await this.eventHistoryService.updateHistory(event, context);

    const chainId = ~~this.configService.get<number>("CHAIN_ID", Number(testChainId));

    await this.contractService.create({
      address: account.toLowerCase(),
      title: `${ModuleType.PONZI} (new)`,
      description: emptyStateString,
      parameters: {
        payees: payees.toString(),
        shares: shares.toString(),
      },
      imageUrl,
      contractFeatures:
        contractTemplate === "0"
          ? (["ALLOWANCE", "PAUSABLE"] as Array<ContractFeatures>)
          : (["WITHDRAW", "ALLOWANCE", "SPLITTER", "REFERRAL", "PAUSABLE"] as Array<ContractFeatures>),
      contractModule: ModuleType.PONZI,
      chainId,
      fromBlock: parseInt(context.blockNumber.toString(), 16),
      merchantId: await this.getMerchantId(externalId),
    });

    this.ponziLogService.addListener({
      address: [account.toLowerCase()],
      fromBlock: parseInt(context.blockNumber.toString(), 16),
    });

    await this.signalClientProxy
      .emit(SignalEventType.TRANSACTION_HASH, {
        account: await this.getUserWalletById(externalId),
        transactionHash,
        transactionType: name,
      })
      .toPromise();
  }

  public async lottery(event: ILogEvent<IContractManagerLotteryDeployedEvent>, context: Log): Promise<void> {
    const {
      name,
      args: { account, args, externalId },
    } = event;
    const { transactionHash } = context;

    const { config } = args;
    const { timeLagBeforeRelease, commission } = config;

    await this.eventHistoryService.updateHistory(event, context);

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
      contractFeatures: [ContractFeatures.RANDOM, ContractFeatures.ALLOWANCE, ContractFeatures.PAUSABLE],
      contractModule: ModuleType.LOTTERY,
      chainId,
      fromBlock: parseInt(context.blockNumber.toString(), 16),
      merchantId: await this.getMerchantId(externalId),
    });

    await this.chainLinkLogService.updateListener();
    this.lotteryLogService.addListener({
      address: [account.toLowerCase()],
      fromBlock: parseInt(context.blockNumber.toString(), 16),
    });

    await this.signalClientProxy
      .emit(SignalEventType.TRANSACTION_HASH, {
        account: await this.getUserWalletById(externalId),
        transactionHash,
        transactionType: name,
      })
      .toPromise();
  }

  public async raffle(event: ILogEvent<IContractManagerRaffleDeployedEvent>, context: Log): Promise<void> {
    const {
      name,
      args: { account, externalId },
    } = event;
    const { transactionHash } = context;

    await this.eventHistoryService.updateHistory(event, context);

    const chainId = ~~this.configService.get<number>("CHAIN_ID", Number(testChainId));

    await this.contractService.create({
      address: account.toLowerCase(),
      title: `${ModuleType.RAFFLE} (new)`,
      description: emptyStateString,
      imageUrl,
      contractFeatures: [ContractFeatures.RANDOM, ContractFeatures.ALLOWANCE, ContractFeatures.PAUSABLE],
      contractModule: ModuleType.RAFFLE,
      chainId,
      fromBlock: parseInt(context.blockNumber.toString(), 16),
      merchantId: await this.getMerchantId(externalId),
    });

    await this.chainLinkLogService.updateListener();
    this.raffleLogService.addListener({
      address: [account.toLowerCase()],
      fromBlock: parseInt(context.blockNumber.toString(), 16),
    });

    await this.signalClientProxy
      .emit(SignalEventType.TRANSACTION_HASH, {
        account: await this.getUserWalletById(externalId),
        transactionHash,
        transactionType: name,
      })
      .toPromise();
  }

  public async waitList(event: ILogEvent<IContractManagerWaitListDeployedEvent>, context: Log): Promise<void> {
    const {
      name,
      args: { account, externalId },
    } = event;
    const { transactionHash } = context;

    await this.eventHistoryService.updateHistory(event, context);

    const chainId = ~~this.configService.get<number>("CHAIN_ID", Number(testChainId));

    await this.contractService.create({
      address: account.toLowerCase(),
      title: `${ModuleType.WAIT_LIST} (new)`,
      description: emptyStateString,
      imageUrl,
      contractFeatures: [ContractFeatures.PAUSABLE],
      contractModule: ModuleType.WAIT_LIST,
      chainId,
      fromBlock: parseInt(context.blockNumber.toString(), 16),
      merchantId: await this.getMerchantId(externalId),
    });

    this.waitListLogService.addListener({
      address: [account.toLowerCase()],
      fromBlock: parseInt(context.blockNumber.toString(), 16),
    });

    await this.signalClientProxy
      .emit(SignalEventType.TRANSACTION_HASH, {
        account: await this.getUserWalletById(externalId),
        transactionHash,
        transactionType: name,
      })
      .toPromise();
  }

  public async paymentSplitter(
    event: ILogEvent<IContractManagerPaymentSplitterDeployedEvent>,
    context: Log,
  ): Promise<void> {
    const {
      name,
      args: { account, externalId, args },
    } = event;
    const { transactionHash } = context;

    const { payees, shares } = args;

    await this.eventHistoryService.updateHistory(event, context);

    const chainId = ~~this.configService.get<number>("CHAIN_ID", Number(testChainId));

    await this.contractService.create({
      address: account.toLowerCase(),
      title: `${ModuleType.PAYMENT_SPLITTER} (new)`,
      description: emptyStateString,
      parameters: {
        payees: payees.map(payee => payee.toLowerCase()),
        shares: shares.map(share => share.toLowerCase()),
      },
      imageUrl,
      contractFeatures: [],
      // TODO active from deploy?
      contractStatus: ContractStatus.ACTIVE,
      contractModule: ModuleType.PAYMENT_SPLITTER,
      chainId,
      fromBlock: parseInt(context.blockNumber.toString(), 16),
      merchantId: await this.getMerchantId(externalId),
    });

    this.paymentSplitterLogService.addListener({
      address: [account.toLowerCase()],
      fromBlock: parseInt(context.blockNumber.toString(), 16),
    });

    await this.signalClientProxy
      .emit(SignalEventType.TRANSACTION_HASH, {
        account: await this.getUserWalletById(externalId),
        transactionHash,
        transactionType: name,
      })
      .toPromise();
  }

  public async staking(event: ILogEvent<IContractManagerStakingDeployedEvent>, context: Log): Promise<void> {
    const {
      name,
      args: { account, externalId },
    } = event;
    const { transactionHash } = context;

    // const { contractTemplate } = args;

    await this.eventHistoryService.updateHistory(event, context);

    const chainId = ~~this.configService.get<number>("CHAIN_ID", Number(testChainId));

    await this.contractService.create({
      address: account.toLowerCase(),
      title: `${ModuleType.STAKING} (new)`,
      description: emptyStateString,
      imageUrl,
      // TODO better set ContractFeatures
      contractFeatures: [ContractFeatures.WITHDRAW, ContractFeatures.ALLOWANCE, ContractFeatures.REFERRAL],
      // contractFeatures:
      //   contractTemplate === "0"
      //     ? [ContractFeatures.WITHDRAW, ContractFeatures.ALLOWANCE, ContractFeatures.REFERRAL]
      //     : (Object.values(StakingContractFeatures)[Number(contractTemplate)].split("_") as Array<ContractFeatures>),
      contractModule: ModuleType.STAKING,
      chainId,
      fromBlock: parseInt(context.blockNumber.toString(), 16),
      merchantId: await this.getMerchantId(externalId),
    });

    this.stakingLogService.addListener({
      address: [account.toLowerCase()],
      fromBlock: parseInt(context.blockNumber.toString(), 16),
    });

    await this.signalClientProxy
      .emit(SignalEventType.TRANSACTION_HASH, {
        account: await this.getUserWalletById(externalId),
        transactionHash,
        transactionType: name,
      })
      .toPromise();
  }

  private async createBalancesBatch(externalId: number, tokenArray: Array<TokenEntity>) {
    const currentDateTime = new Date().toISOString();

    const userEntity = await this.userService.findOne({ id: externalId });
    if (!userEntity) {
      this.loggerService.error("CRITICAL ERROR", ContractManagerServiceEth.name);
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

  public parseErc721Template(contractTemplate: string): {
    contractFeatures: Array<ContractFeatures>;
    contractModule: ModuleType;
  } {
    switch (Object.values(Erc721ContractTemplates)[Number(contractTemplate)]) {
      case Erc721ContractTemplates.RAFFLE:
        return { contractFeatures: [], contractModule: ModuleType.RAFFLE };
      case Erc721ContractTemplates.LOTTERY:
        return { contractFeatures: [], contractModule: ModuleType.LOTTERY };
      case Erc721ContractTemplates.SIMPLE:
        return { contractFeatures: [], contractModule: ModuleType.HIERARCHY };
      default:
        return {
          contractFeatures:
            contractTemplate === "0" || ""
              ? []
              : (Object.values(Erc721ContractTemplates)[Number(contractTemplate)].split(
                  "_",
                ) as Array<ContractFeatures>),
          contractModule: ModuleType.HIERARCHY,
        };
    }
  }

  public async getMerchantId(userId: number): Promise<number> {
    const userEntity = await this.userService.findOne({ id: userId });
    if (!userEntity) {
      this.loggerService.error("CRITICAL ERROR", ContractManagerServiceEth.name);
      throw new NotFoundException("userNotFound");
    }
    return userEntity.merchantId;
  }

  public async getUserWalletById(userId: number): Promise<string> {
    const userEntity = await this.userService.findOne({ id: userId });
    if (!userEntity) {
      this.loggerService.error("CRITICAL ERROR", ContractManagerServiceEth.name);
      throw new NotFoundException("userNotFound");
    }
    return userEntity.wallet;
  }
}
