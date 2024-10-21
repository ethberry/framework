import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { ConfigService } from "@nestjs/config";
import { JsonRpcProvider, Log, Wallet } from "ethers";

import type { ILogEvent } from "@ethberry/nest-js-module-ethers-gcp";
import { ETHERS_RPC, ETHERS_SIGNER } from "@ethberry/nest-js-module-ethers-gcp";

import { emptyStateString } from "@ethberry/draft-js-utils";
import { imageUrl, testChainId } from "@framework/constants";
import type {
  IContractManagerLootTokenDeployedEvent,
  IContractManagerLotteryDeployedEvent,
  IContractManagerMysteryTokenDeployedEvent,
  IContractManagerPonziDeployedEvent,
  IContractManagerRaffleDeployedEvent,
  IContractManagerStakingDeployedEvent,
  IContractManagerVestingDeployedEvent,
} from "@framework/types";
import {
  ContractFeatures,
  ContractSecurity,
  LootContractTemplates,
  ModuleType,
  MysteryContractTemplates,
  RmqProviderType,
  SignalEventType,
  TokenType,
} from "@framework/types";

import { UserService } from "../../infrastructure/user/user.service";
import { ContractService } from "../hierarchy/contract/contract.service";
import { TemplateService } from "../hierarchy/template/template.service";
import { TokenService } from "../hierarchy/token/token.service";
import { BalanceService } from "../hierarchy/balance/balance.service";
import { EventHistoryService } from "../event-history/event-history.service";
import { ClaimService } from "../mechanics/marketing/claim/claim.service";
import { decodeExternalId } from "../../common/utils";
import { LotteryRoundServiceLog } from "../mechanics/gambling/lottery/round/round.service.log";
import { RaffleRoundServiceLog } from "../mechanics/gambling/raffle/round/round.service.log";
import { MysteryBoxServiceLog } from "../mechanics/marketing/mystery/box/box.service.log";
import { LootBoxServiceLog } from "../mechanics/marketing/loot/box/box.service.log";
import { PonziServiceLog } from "../mechanics/gambling/ponzi/ponzi.service.log";
import { VestingServiceLog } from "../mechanics/marketing/vesting/vesting.service.log";
import { StakingContractServiceLog } from "../mechanics/marketing/staking/contract/contract.service.log";

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
    private readonly templateService: TemplateService,
    private readonly tokenService: TokenService,
    private readonly balanceService: BalanceService,
    private readonly userService: UserService,
    private readonly claimService: ClaimService,
    private readonly mysteryBoxServiceLog: MysteryBoxServiceLog,
    private readonly lootBoxServiceLog: LootBoxServiceLog,
    private readonly lotteryRoundServiceLog: LotteryRoundServiceLog,
    private readonly raffleRoundServiceLog: RaffleRoundServiceLog,
    private readonly vestingServiceLog: VestingServiceLog,
    private readonly ponziServiceLog: PonziServiceLog,
    private readonly stakingContractServiceLog: StakingContractServiceLog,
  ) {}

  public async mystery(event: ILogEvent<IContractManagerMysteryTokenDeployedEvent>, context: Log): Promise<void> {
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

    this.mysteryBoxServiceLog.updateRegistry([account]);

    await this.signalClientProxy
      .emit(SignalEventType.TRANSACTION_HASH, {
        account: await this.getUserWalletById(externalId),
        transactionHash,
        transactionType: event.name,
      })
      .toPromise();
  }

  public async loot(event: ILogEvent<IContractManagerLootTokenDeployedEvent>, context: Log): Promise<void> {
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
          : (Object.values(LootContractTemplates)[Number(contractTemplate)].split("_") as Array<ContractFeatures>),
      contractType: TokenType.ERC721,
      contractModule: ModuleType.LOOT,
      chainId,
      royalty: Number(royalty),
      baseTokenURI,
      fromBlock: parseInt(context.blockNumber.toString(), 16),
      merchantId: await this.getMerchantId(externalId),
    });

    this.lootBoxServiceLog.updateRegistry([account]);

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

    this.vestingServiceLog.updateRegistry([account]);

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

    this.ponziServiceLog.updateRegistry([account]);

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

    this.lotteryRoundServiceLog.updateRegistry([account]);

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

    this.raffleRoundServiceLog.updateRegistry([account]);

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

    this.stakingContractServiceLog.updateRegistry([account]);

    await this.signalClientProxy
      .emit(SignalEventType.TRANSACTION_HASH, {
        account: await this.getUserWalletById(externalId),
        transactionHash,
        transactionType: name,
      })
      .toPromise();
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
