import { Inject, Injectable, Logger, LoggerService } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Log } from "@ethersproject/abstract-provider";

import { ILogEvent } from "@gemunion/nestjs-ethers";

import { emptyStateString } from "@gemunion/draft-js-utils";

import { imageUrl } from "@framework/constants";

import {
  ContractManagerEventType,
  ContractTemplate,
  ContractType,
  IContractManagerERC1155TokenDeployed,
  IContractManagerERC20TokenDeployed,
  IContractManagerERC721TokenDeployed,
  IContractManagerERC998TokenDeployed,
  IContractManagerVestingDeployed,
  TContractManagerEventData,
  TokenType,
  VestingTemplate,
} from "@framework/types";

import { ContractManagerHistoryService } from "./contract-manager-history/contract-manager-history.service";
import { VestingService } from "../../mechanics/vesting/vesting.service";
import { Erc20LogService } from "../../erc20/token/token-log/token-log.service";
import { Erc721TokenLogService } from "../../erc721/token/token-log/token-log.service";
import { Erc998TokenLogService } from "../../erc998/token/token-log/token-log.service";
import { Erc1155LogService } from "../../erc1155/token/token-log/token-log.service";
import { VestingLogService } from "../../mechanics/vesting/vesting-log/vesting.log.service";
import { ContractManagerService } from "./contract-manager.service";
import { ContractService } from "../hierarchy/contract/contract.service";
import { TemplateService } from "../hierarchy/template/template.service";
import { TokenService } from "../hierarchy/token/token.service";
import { GradeService } from "../../mechanics/grade/grade.service";

@Injectable()
export class ContractManagerServiceEth {
  private chainId: number;

  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly configService: ConfigService,
    private readonly contractManagerService: ContractManagerService,
    private readonly contractManagerHistoryService: ContractManagerHistoryService,
    private readonly vestingService: VestingService,
    private readonly contractService: ContractService,
    private readonly erc20LogService: Erc20LogService,
    private readonly erc721LogService: Erc721TokenLogService,
    private readonly erc998LogService: Erc998TokenLogService,
    private readonly erc1155LogService: Erc1155LogService,
    private readonly vestingLogService: VestingLogService,
    private readonly templateService: TemplateService,
    private readonly tokenService: TokenService,
    private readonly gradeService: GradeService,
  ) {
    this.chainId = ~~configService.get<string>("CHAIN_ID", "1337");
  }

  public async vesting(event: ILogEvent<IContractManagerVestingDeployed>, ctx: Log): Promise<void> {
    const {
      args: { addr, account, startTimestamp, duration, templateId },
    } = event;

    await this.updateHistory(event, ctx);

    await this.vestingService.create({
      address: addr.toLowerCase(),
      account: account.toLowerCase(),
      startTimestamp: new Date(~~startTimestamp * 1000).toISOString(),
      duration: ~~duration * 1000, // msec
      contractTemplate: Object.values(VestingTemplate)[~~templateId],
      chainId: this.chainId,
    });

    await this.vestingLogService.addListener({
      address: addr.toLowerCase(),
      fromBlock: parseInt(ctx.blockNumber.toString(), 16),
    });
  }

  public async erc20Token(event: ILogEvent<IContractManagerERC20TokenDeployed>, ctx: Log): Promise<void> {
    const {
      args: { addr, name, symbol, cap, templateId },
    } = event;

    await this.updateHistory(event, ctx);

    const contractTemplate =
      ~~templateId === 0 // SIMPLE
        ? Object.values(ContractTemplate)[1]
        : ~~templateId === 1 // BLACKLIST
        ? Object.values(ContractTemplate)[2]
        : ~~templateId === 2 // EXTERNAL
        ? Object.values(ContractTemplate)[3]
        : Object.values(ContractTemplate)[4]; // NATIVE

    const erc20ContractEntity = await this.contractService.create({
      address: addr.toLowerCase(),
      title: name,
      name,
      symbol,
      decimals: 18,
      description: emptyStateString,
      imageUrl,
      royalty: 0, // todo default or nullable in entity?
      contractTemplate,
      contractType: TokenType.ERC20,
      chainId: this.chainId,
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

    await this.erc20LogService.addListener({
      address: addr.toLowerCase(),
      fromBlock: parseInt(ctx.blockNumber.toString(), 16),
    });
  }

  public async erc721Token(event: ILogEvent<IContractManagerERC721TokenDeployed>, ctx: Log): Promise<void> {
    const {
      args: { addr, name, symbol, royalty, baseTokenURI, templateId },
    } = event;

    await this.updateHistory(event, ctx);

    const contractTemplate =
      ~~templateId === 0
        ? Object.values(ContractTemplate)[1] // Simple
        : ~~templateId === 1
        ? Object.values(ContractTemplate)[5] // Graded
        : Object.values(ContractTemplate)[6]; // Random

    const contractEntity = await this.contractService.create({
      address: addr.toLowerCase(),
      title: name,
      name,
      symbol,
      description: emptyStateString,
      imageUrl,
      contractTemplate,
      contractType: TokenType.ERC721,
      chainId: this.chainId,
      royalty: ~~royalty,
      baseTokenURI,
    });

    if (contractTemplate === ContractTemplate.GRADED || contractTemplate === ContractTemplate.RANDOM) {
      await this.gradeService.create({ contract: contractEntity });
    }

    await this.erc721LogService.addListener({
      address: addr.toLowerCase(),
      fromBlock: parseInt(ctx.blockNumber.toString(), 16),
    });
  }

  public async erc998Token(event: ILogEvent<IContractManagerERC998TokenDeployed>, ctx: Log): Promise<void> {
    const {
      args: { addr, name, symbol, royalty, baseTokenURI, templateId },
    } = event;

    await this.updateHistory(event, ctx);

    const contractTemplate =
      ~~templateId === 0
        ? Object.values(ContractTemplate)[1] // Simple
        : ~~templateId === 1
        ? Object.values(ContractTemplate)[5] // Graded
        : Object.values(ContractTemplate)[6]; // Random

    const contractEntity = await this.contractService.create({
      address: addr.toLowerCase(),
      title: name,
      name,
      symbol,
      description: emptyStateString,
      imageUrl,
      contractTemplate,
      contractType: TokenType.ERC998,
      chainId: this.chainId,
      royalty: ~~royalty,
      baseTokenURI,
    });

    if (contractTemplate === ContractTemplate.GRADED || contractTemplate === ContractTemplate.RANDOM) {
      await this.gradeService.create({ contract: contractEntity });
    }

    await this.erc998LogService.addListener({
      address: addr.toLowerCase(),
      fromBlock: parseInt(ctx.blockNumber.toString(), 16),
    });
  }

  public async erc1155Token(event: ILogEvent<IContractManagerERC1155TokenDeployed>, ctx: Log): Promise<void> {
    const {
      args: { addr, baseTokenURI, templateId },
    } = event;

    await this.updateHistory(event, ctx);

    const contractTemplate =
      ~~templateId === 0 // SIMPLE
        ? Object.values(ContractTemplate)[1]
        : Object.values(ContractTemplate)[0]; // UNKNOWN todo trow err?

    await this.contractService.create({
      address: addr.toLowerCase(),
      title: "new 1155 contract",
      name: "new 1155 contract",
      description: emptyStateString,
      imageUrl,
      symbol: "ERC1155", // todo allow nulls?
      royalty: 0, // todo default or nullable in entity?
      baseTokenURI,
      contractTemplate,
      contractType: TokenType.ERC1155,
      chainId: this.chainId,
    });

    await this.erc1155LogService.addListener({
      address: addr.toLowerCase(),
      fromBlock: parseInt(ctx.blockNumber.toString(), 16),
    });
  }

  private async updateHistory(event: ILogEvent<TContractManagerEventData>, ctx: Log) {
    this.loggerService.log(
      JSON.stringify(
        Object.assign({
          name: event.name,
          signature: event.signature,
          topic: event.topic,
          args: event.args,
          address: ctx.address,
          transactionHash: ctx.transactionHash,
          blockNumber: ctx.blockNumber,
        }),
        null,
        "\t",
      ),
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

    await this.contractManagerService.updateLastBlockByType(
      ContractType.CONTRACT_MANAGER,
      parseInt(blockNumber.toString(), 16),
    );
  }
}
