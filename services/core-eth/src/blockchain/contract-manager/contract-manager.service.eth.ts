import { Inject, Injectable, Logger, LoggerService } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Log } from "@ethersproject/abstract-provider";
import { DeepPartial } from "typeorm";

import type { ILogEvent } from "@gemunion/nestjs-ethers";
import { emptyStateString } from "@gemunion/draft-js-utils";
import { imageUrl, testChainId } from "@framework/constants";
import {
  ContractFeatures,
  IContractManagerCollectionDeployedEvent,
  IContractManagerERC1155TokenDeployedEvent,
  IContractManagerERC20TokenDeployedEvent,
  IContractManagerERC721TokenDeployedEvent,
  IContractManagerERC998TokenDeployedEvent,
  IContractManagerMysteryTokenDeployedEvent,
  IContractManagerVestingDeployedEvent,
  ModuleType,
  TemplateStatus,
  TokenType,
} from "@framework/types";
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
import { BalanceEntity } from "../hierarchy/balance/balance.entity";
import { BalanceService } from "../hierarchy/balance/balance.service";
import { StakingLogService } from "../mechanics/staking/log/log.service";
import { EventHistoryService } from "../event-history/event-history.service";

@Injectable()
export class ContractManagerServiceEth {
  private imgUrl: string;

  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly configService: ConfigService,
    private readonly eventHistoryService: EventHistoryService,
    private readonly contractService: ContractService,
    private readonly erc20LogService: Erc20LogService,
    private readonly erc721LogService: Erc721TokenLogService,
    private readonly erc998LogService: Erc998TokenLogService,
    private readonly erc1155LogService: Erc1155LogService,
    private readonly vestingLogService: VestingLogService,
    private readonly stakingLogService: StakingLogService,
    private readonly mysteryboxLogService: MysteryLogService,
    private readonly pyramidLogService: PyramidLogService,
    private readonly templateService: TemplateService,
    private readonly tokenService: TokenService,
    private readonly gradeService: GradeService,
    private readonly balanceService: BalanceService,
  ) {
    this.imgUrl = this.configService.get<string>("TOKEN_IMG_URL", "");
  }

  public async erc20Token(event: ILogEvent<IContractManagerERC20TokenDeployedEvent>, ctx: Log): Promise<void> {
    const {
      args: { addr, args },
    } = event;

    const [name, symbol, cap, contractTemplate] = args;

    await this.eventHistoryService.updateHistory(event, ctx);

    const chainId = ~~this.configService.get<number>("CHAIN_ID", testChainId);

    const erc20ContractEntity = await this.contractService.create({
      address: addr.toLowerCase(),
      title: name,
      name,
      symbol,
      decimals: 18,
      description: emptyStateString,
      imageUrl,
      contractFeatures: contractTemplate.split("_") as Array<ContractFeatures>,
      contractType: TokenType.ERC20,
      chainId,
      fromBlock: parseInt(ctx.blockNumber.toString(), 16),
    });

    const templateEntity = await this.templateService.create({
      title: name,
      description: emptyStateString,
      imageUrl,
      cap,
      contractId: erc20ContractEntity.id,
    });

    await this.tokenService.create({
      attributes: "{}",
      tokenId: "0",
      royalty: 0,
      template: templateEntity,
    });

    this.erc20LogService.addListener({
      address: [addr.toLowerCase()],
      fromBlock: parseInt(ctx.blockNumber.toString(), 16),
    });
  }

  public async erc721Token(event: ILogEvent<IContractManagerERC721TokenDeployedEvent>, ctx: Log): Promise<void> {
    const {
      args: { addr, args },
    } = event;

    const [name, symbol, royalty, baseTokenURI, contractTemplate] = args;

    await this.eventHistoryService.updateHistory(event, ctx);

    const chainId = ~~this.configService.get<number>("CHAIN_ID", testChainId);

    const contractEntity = await this.contractService.create({
      address: addr.toLowerCase(),
      title: name,
      name,
      symbol,
      description: emptyStateString,
      imageUrl,
      contractFeatures: contractTemplate.split("_") as Array<ContractFeatures>,
      contractType: TokenType.ERC721,
      chainId,
      royalty: ~~royalty,
      baseTokenURI,
      fromBlock: parseInt(ctx.blockNumber.toString(), 16),
    });

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

    this.erc721LogService.addListener({
      address: [addr.toLowerCase()],
      fromBlock: parseInt(ctx.blockNumber.toString(), 16),
    });
  }

  public async erc721Collection(event: ILogEvent<IContractManagerCollectionDeployedEvent>, ctx: Log): Promise<void> {
    const {
      args: { addr, args, owner },
    } = event;

    const [name, symbol, royalty, baseTokenURI, batchSize, contractTemplate] = args;

    await this.eventHistoryService.updateHistory(event, ctx);

    const chainId = ~~this.configService.get<number>("CHAIN_ID", testChainId);

    const contractEntity = await this.contractService.create({
      address: addr.toLowerCase(),
      title: name,
      name,
      symbol,
      description: JSON.stringify({ batchSize, owner }),
      imageUrl,
      contractFeatures: contractTemplate.split("_") as Array<ContractFeatures>,
      contractType: TokenType.ERC721,
      contractModule: ModuleType.COLLECTION,
      chainId,
      royalty: ~~royalty,
      baseTokenURI,
      fromBlock: parseInt(ctx.blockNumber.toString(), 16),
    });

    const templateEntity = await this.templateService.create({
      title: name,
      description: emptyStateString,
      imageUrl,
      cap: batchSize.toString(), // todo or ZERO ?
      contractId: contractEntity.id,
    });

    // TODO add options to set naming scheme ?

    const currentDateTime = new Date().toISOString();
    const tokenArray: Array<DeepPartial<TokenEntity>> = [...Array(~~batchSize)].map((_, i) => ({
      attributes: "{}",
      tokenId: i.toString(),
      royalty: ~~royalty,
      imageUrl: `${this.imgUrl}/collection/${addr.toLowerCase()}/${i}.jpg`,
      template: templateEntity,
      createdAt: currentDateTime,
      updatedAt: currentDateTime,
    }));

    const entityArray = await this.tokenService.createBatch(tokenArray);

    await this.createBalancesBatch(owner, entityArray);

    this.erc721LogService.addListener({
      address: [addr.toLowerCase()],
      fromBlock: parseInt(ctx.blockNumber.toString(), 16),
    });
  }

  private async createBalancesBatch(owner: string, tokenArray: Array<TokenEntity>) {
    const currentDateTime = new Date().toISOString();

    const balanceArray: Array<DeepPartial<BalanceEntity>> = [...Array(tokenArray.length)].map((_, i) => ({
      account: owner.toLowerCase(),
      amount: "1",
      tokenId: tokenArray[i].id,
      createdAt: currentDateTime,
      updatedAt: currentDateTime,
    }));

    await this.balanceService.createBatch(balanceArray);
  }

  public async erc998Token(event: ILogEvent<IContractManagerERC998TokenDeployedEvent>, ctx: Log): Promise<void> {
    const {
      args: { addr, args },
    } = event;

    const [name, symbol, royalty, baseTokenURI, contractTemplate] = args;

    await this.eventHistoryService.updateHistory(event, ctx);

    const chainId = ~~this.configService.get<number>("CHAIN_ID", testChainId);

    const contractEntity = await this.contractService.create({
      address: addr.toLowerCase(),
      title: name,
      name,
      symbol,
      description: emptyStateString,
      imageUrl,
      contractFeatures: contractTemplate.split("_") as Array<ContractFeatures>,
      contractType: TokenType.ERC998,
      chainId,
      royalty: ~~royalty,
      baseTokenURI,
      fromBlock: parseInt(ctx.blockNumber.toString(), 16),
    });

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

    this.erc998LogService.addListener({
      address: [addr.toLowerCase()],
      fromBlock: parseInt(ctx.blockNumber.toString(), 16),
    });
  }

  public async erc1155Token(event: ILogEvent<IContractManagerERC1155TokenDeployedEvent>, ctx: Log): Promise<void> {
    const {
      args: { addr, args },
    } = event;

    const [baseTokenURI, contractTemplate] = args;

    await this.eventHistoryService.updateHistory(event, ctx);

    const chainId = ~~this.configService.get<number>("CHAIN_ID", testChainId);

    await this.contractService.create({
      address: addr.toLowerCase(),
      title: "new 1155 contract",
      description: emptyStateString,
      imageUrl,
      baseTokenURI,
      contractFeatures: contractTemplate.split("_") as Array<ContractFeatures>,
      contractType: TokenType.ERC1155,
      chainId,
      fromBlock: parseInt(ctx.blockNumber.toString(), 16),
    });

    this.erc1155LogService.addListener({
      address: [addr.toLowerCase()],
      fromBlock: parseInt(ctx.blockNumber.toString(), 16),
    });
  }

  public async mysterybox(event: ILogEvent<IContractManagerMysteryTokenDeployedEvent>, ctx: Log): Promise<void> {
    const {
      args: { addr, args },
    } = event;

    const [name, symbol, baseTokenURI, royalty, contractTemplate] = args;

    await this.eventHistoryService.updateHistory(event, ctx);

    const chainId = ~~this.configService.get<number>("CHAIN_ID", testChainId);

    await this.contractService.create({
      address: addr.toLowerCase(),
      title: name,
      name,
      symbol,
      description: emptyStateString,
      imageUrl,
      contractFeatures: contractTemplate.split("_") as Array<ContractFeatures>,
      contractType: TokenType.ERC721,
      contractModule: ModuleType.MYSTERY,
      chainId,
      royalty: ~~royalty,
      baseTokenURI,
      fromBlock: parseInt(ctx.blockNumber.toString(), 16),
    });

    this.mysteryboxLogService.addListener({
      address: [addr.toLowerCase()],
      fromBlock: parseInt(ctx.blockNumber.toString(), 16),
    });
  }

  public async vesting(event: ILogEvent<IContractManagerVestingDeployedEvent>, ctx: Log): Promise<void> {
    const {
      args: { addr, args },
    } = event;

    const [account, startTimestamp, duration, contractTemplate] = args;

    await this.eventHistoryService.updateHistory(event, ctx);

    const chainId = ~~this.configService.get<number>("CHAIN_ID", testChainId);

    await this.contractService.create({
      address: addr.toLowerCase(),
      title: contractTemplate,
      description: emptyStateString,
      imageUrl,
      parameters: JSON.stringify({
        account: account.toLowerCase(),
        startTimestamp: new Date(~~startTimestamp * 1000).toISOString(),
        duration: ~~duration * 1000,
      }),
      contractFeatures: [contractTemplate as ContractFeatures],
      contractModule: ModuleType.VESTING,
      chainId,
      fromBlock: parseInt(ctx.blockNumber.toString(), 16),
    });

    this.vestingLogService.addListener({
      address: [addr.toLowerCase()],
      fromBlock: parseInt(ctx.blockNumber.toString(), 16),
    });
  }
}
