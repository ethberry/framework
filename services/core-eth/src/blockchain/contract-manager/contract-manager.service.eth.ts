import { Inject, Injectable, Logger, LoggerService } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Log } from "@ethersproject/abstract-provider";

import type { ILogEvent } from "@gemunion/nestjs-ethers";
import { emptyStateString } from "@gemunion/draft-js-utils";
import { imageUrl } from "@framework/constants";
import {
  ContractFeatures,
  ContractManagerEventType,
  Erc1155ContractFeatures,
  Erc20ContractFeatures,
  Erc721ContractFeatures,
  Erc998ContractFeatures,
  IContractManagerERC1155TokenDeployedEvent,
  IContractManagerERC20TokenDeployedEvent,
  IContractManagerERC721TokenDeployedEvent,
  IContractManagerERC998TokenDeployedEvent,
  IContractManagerMysteryTokenDeployedEvent,
  IContractManagerPyramidDeployedEvent,
  IContractManagerVestingDeployedEvent,
  ModuleType,
  MysteryContractFeatures,
  PyramidContractFeatures,
  TContractManagerEventData,
  TemplateStatus,
  TokenType,
  VestingContractTemplate,
} from "@framework/types";

import { ContractManagerHistoryService } from "./history/history.service";
import { VestingService } from "../mechanics/vesting/vesting.service";
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

@Injectable()
export class ContractManagerServiceEth {
  private chainId: number;

  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly configService: ConfigService,
    private readonly contractManagerHistoryService: ContractManagerHistoryService,
    private readonly vestingService: VestingService,
    private readonly contractService: ContractService,
    private readonly erc20LogService: Erc20LogService,
    private readonly erc721LogService: Erc721TokenLogService,
    private readonly erc998LogService: Erc998TokenLogService,
    private readonly erc1155LogService: Erc1155LogService,
    private readonly vestingLogService: VestingLogService,
    private readonly mysteryboxLogService: MysteryLogService,
    private readonly pyramidLogService: PyramidLogService,
    private readonly templateService: TemplateService,
    private readonly tokenService: TokenService,
    private readonly gradeService: GradeService,
  ) {
    this.chainId = ~~configService.get<string>("CHAIN_ID", "13378");
  }

  public async erc20Token(event: ILogEvent<IContractManagerERC20TokenDeployedEvent>, ctx: Log): Promise<void> {
    const {
      args: { addr, name, symbol, cap, featureIds },
    } = event;

    await this.updateHistory(event, ctx);

    const availableFeatures = Object.values(Erc20ContractFeatures);
    const contractFeatures = featureIds.map(featureId => availableFeatures[featureId]);

    const erc20ContractEntity = await this.contractService.create({
      address: addr.toLowerCase(),
      title: name,
      name,
      symbol,
      decimals: 18,
      description: emptyStateString,
      imageUrl,
      contractFeatures: contractFeatures as unknown as Array<ContractFeatures>,
      contractType: TokenType.ERC20,
      chainId: this.chainId,
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
      args: { addr, name, symbol, royalty, baseTokenURI, featureIds },
    } = event;

    await this.updateHistory(event, ctx);

    const availableFeatures = Object.values(Erc721ContractFeatures);
    const contractFeatures = featureIds.map(featureId => availableFeatures[featureId]);

    const contractEntity = await this.contractService.create({
      address: addr.toLowerCase(),
      title: name,
      name,
      symbol,
      description: emptyStateString,
      imageUrl,
      contractFeatures: contractFeatures as unknown as Array<ContractFeatures>,
      contractType: TokenType.ERC721,
      chainId: this.chainId,
      royalty: ~~royalty,
      baseTokenURI,
      fromBlock: parseInt(ctx.blockNumber.toString(), 16),
    });

    if (contractFeatures.includes(Erc721ContractFeatures.UPGRADEABLE)) {
      await this.gradeService.create({ contract: contractEntity });
    }

    if (contractFeatures.includes(Erc721ContractFeatures.GENES)) {
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

  public async erc998Token(event: ILogEvent<IContractManagerERC998TokenDeployedEvent>, ctx: Log): Promise<void> {
    const {
      args: { addr, name, symbol, royalty, baseTokenURI, featureIds },
    } = event;

    await this.updateHistory(event, ctx);

    const availableFeatures = Object.values(Erc998ContractFeatures);
    const contractFeatures = featureIds.map(featureId => availableFeatures[featureId]);

    const contractEntity = await this.contractService.create({
      address: addr.toLowerCase(),
      title: name,
      name,
      symbol,
      description: emptyStateString,
      imageUrl,
      contractFeatures: contractFeatures as unknown as Array<ContractFeatures>,
      contractType: TokenType.ERC998,
      chainId: this.chainId,
      royalty: ~~royalty,
      baseTokenURI,
      fromBlock: parseInt(ctx.blockNumber.toString(), 16),
    });

    if (contractFeatures.includes(Erc998ContractFeatures.UPGRADEABLE)) {
      await this.gradeService.create({ contract: contractEntity });
    }

    this.erc998LogService.addListener({
      address: [addr.toLowerCase()],
      fromBlock: parseInt(ctx.blockNumber.toString(), 16),
    });
  }

  public async erc1155Token(event: ILogEvent<IContractManagerERC1155TokenDeployedEvent>, ctx: Log): Promise<void> {
    const {
      args: { addr, baseTokenURI, featureIds },
    } = event;

    await this.updateHistory(event, ctx);

    const availableFeatures = Object.values(Erc1155ContractFeatures);
    const contractFeatures = featureIds.map(featureId => availableFeatures[featureId]);

    await this.contractService.create({
      address: addr.toLowerCase(),
      title: "new 1155 contract",
      description: emptyStateString,
      imageUrl,
      baseTokenURI,
      contractFeatures: contractFeatures as unknown as Array<ContractFeatures>,
      contractType: TokenType.ERC1155,
      chainId: this.chainId,
      fromBlock: parseInt(ctx.blockNumber.toString(), 16),
    });

    this.erc1155LogService.addListener({
      address: [addr.toLowerCase()],
      fromBlock: parseInt(ctx.blockNumber.toString(), 16),
    });
  }

  public async mysterybox(event: ILogEvent<IContractManagerMysteryTokenDeployedEvent>, ctx: Log): Promise<void> {
    const {
      args: { addr, name, symbol, baseTokenURI, royalty, featureIds },
    } = event;

    await this.updateHistory(event, ctx);

    const availableFeatures = Object.values(MysteryContractFeatures);
    const contractFeatures = featureIds.map(featureId => availableFeatures[featureId]);

    await this.contractService.create({
      address: addr.toLowerCase(),
      title: name,
      name,
      symbol,
      description: emptyStateString,
      imageUrl,
      contractFeatures: contractFeatures as unknown as Array<ContractFeatures>,
      contractType: TokenType.ERC721,
      contractModule: ModuleType.MYSTERY,
      chainId: this.chainId,
      royalty: ~~royalty,
      baseTokenURI,
      fromBlock: parseInt(ctx.blockNumber.toString(), 16),
    });

    this.mysteryboxLogService.addListener({
      address: [addr.toLowerCase()],
      fromBlock: parseInt(ctx.blockNumber.toString(), 16),
    });
  }

  public async pyramid(event: ILogEvent<IContractManagerPyramidDeployedEvent>, ctx: Log): Promise<void> {
    const {
      args: { addr, featureIds },
    } = event;

    await this.updateHistory(event, ctx);

    const availableFeatures = Object.values(PyramidContractFeatures);
    const contractFeatures = featureIds.map(featureId => availableFeatures[featureId]);

    await this.contractService.create({
      address: addr.toLowerCase(),
      title: "new PYRAMID contract",
      description: emptyStateString,
      imageUrl,
      contractFeatures: contractFeatures as unknown as Array<ContractFeatures>,
      contractModule: ModuleType.PYRAMID,
      chainId: this.chainId,
      fromBlock: parseInt(ctx.blockNumber.toString(), 16),
    });

    this.pyramidLogService.addListener({
      address: [addr.toLowerCase()],
      fromBlock: parseInt(ctx.blockNumber.toString(), 16),
    });
  }

  public async vesting(event: ILogEvent<IContractManagerVestingDeployedEvent>, ctx: Log): Promise<void> {
    const {
      args: { addr, account, startTimestamp, duration, templateId },
    } = event;

    await this.updateHistory(event, ctx);

    const contractEntity = await this.contractService.create({
      address: addr.toLowerCase(),
      title: Object.values(VestingContractTemplate)[~~templateId].toString(),
      description: emptyStateString,
      imageUrl,
      contractFeatures: [],
      contractModule: ModuleType.VESTING,
      chainId: this.chainId,
      fromBlock: parseInt(ctx.blockNumber.toString(), 16),
    });

    await this.vestingService.create({
      account: account.toLowerCase(),
      startTimestamp: new Date(~~startTimestamp * 1000).toISOString(),
      duration: ~~duration * 1000, // msec
      contractTemplate: Object.values(VestingContractTemplate)[~~templateId],
      contractId: contractEntity.id,
    });

    this.vestingLogService.addListener({
      address: [addr.toLowerCase()],
      fromBlock: parseInt(ctx.blockNumber.toString(), 16),
    });
  }

  private async updateHistory(event: ILogEvent<TContractManagerEventData>, ctx: Log) {
    this.loggerService.log(
      JSON.stringify({
        name: event.name,
        signature: event.signature,
        topic: event.topic,
        args: event.args,
        address: ctx.address,
        transactionHash: ctx.transactionHash,
        blockNumber: ctx.blockNumber,
      }),
      ContractManagerServiceEth.name,
    );

    const { args, name } = event;
    const { address, transactionHash, blockNumber } = ctx;

    await this.contractManagerHistoryService.create({
      address,
      transactionHash,
      eventType: name as ContractManagerEventType,
      eventData: args,
    });

    await this.contractService.updateLastBlockByAddr(address, parseInt(blockNumber.toString(), 16));
  }
}
