import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { constants, providers } from "ethers";
import { Log } from "@ethersproject/abstract-provider";

import { ETHERS_RPC, ILogEvent } from "@gemunion/nestjs-ethers";

import {
  ContractEventType,
  IMysteryboxUnpack,
  ITokenApprove,
  ITokenApprovedForAll,
  ITokenTransfer,
  TContractEventData,
  TokenAttributes,
  TokenStatus,
} from "@framework/types";

import { getMetadata } from "../../../common/utils";

import { ContractManagerService } from "../../contract-manager/contract-manager.service";
import { ContractHistoryService } from "../../contract-history/contract-history.service";
import { ContractService } from "../../hierarchy/contract/contract.service";
import { TemplateService } from "../../hierarchy/template/template.service";
import { TokenService } from "../../hierarchy/token/token.service";
import { BalanceService } from "../../hierarchy/balance/balance.service";
import { ABI } from "../../tokens/erc721/token/token-log/interfaces";
import { MysteryboxService } from "./mysterybox.service";

@Injectable()
export class MysteryboxServiceEth {
  private itemsAddr: string;

  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    @Inject(ETHERS_RPC)
    private readonly jsonRpcProvider: providers.JsonRpcProvider,
    private readonly configService: ConfigService,
    private readonly contractManagerService: ContractManagerService,
    private readonly tokenService: TokenService,
    private readonly templateService: TemplateService,
    private readonly balanceService: BalanceService,
    private readonly contractHistoryService: ContractHistoryService,
    private readonly contractService: ContractService,
    private readonly mysteryboxService: MysteryboxService,
  ) {
    this.itemsAddr = configService.get<string>("ERC721_RANDOM_ADDR", "");
  }

  public async transfer(event: ILogEvent<ITokenTransfer>, context: Log): Promise<void> {
    const {
      args: { from, to, tokenId },
    } = event;
    const { address } = context;

    const contractEntity = await this.contractService.findOne({ address: address.toLowerCase() });

    if (!contractEntity) {
      throw new NotFoundException("contractNotFound");
    }

    // Mint token create
    if (from === constants.AddressZero) {
      const attributes = await getMetadata(tokenId, address, ABI, this.jsonRpcProvider);
      const templateId = ~~attributes[TokenAttributes.TEMPLATE_ID];
      const mysteryboxEntity = await this.mysteryboxService.findOne({ id: templateId });

      if (!mysteryboxEntity) {
        throw new NotFoundException("mysteryboxNotFound");
      }

      const templateEntity = await this.templateService.findOne({ id: mysteryboxEntity.templateId });

      if (!templateEntity) {
        throw new NotFoundException("templateNotFound");
      }

      const tokenEntity = await this.tokenService.create({
        tokenId,
        attributes: JSON.stringify(attributes),
        royalty: contractEntity.royalty,
        template: templateEntity,
      });

      await this.balanceService.increment(tokenEntity.id, from.toLowerCase(), "1");
    }

    const mysteryboxTokenEntity = await this.tokenService.getToken(tokenId, context.address.toLowerCase());

    if (!mysteryboxTokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    await this.updateHistory(event, context, mysteryboxTokenEntity.id);

    if (from === constants.AddressZero) {
      mysteryboxTokenEntity.template.amount += 1;
      // mysteryboxTokenEntity.erc721Template
      //   ? (mysteryboxTokenEntity.template.instanceCount += 1)
      //   : (mysteryboxTokenEntity.mysterybox.template.instanceCount += 1);
      mysteryboxTokenEntity.tokenStatus = TokenStatus.MINTED;
    } else if (to === constants.AddressZero) {
      // mysteryboxTokenEntity.erc721Template.instanceCount -= 1;
      mysteryboxTokenEntity.tokenStatus = TokenStatus.BURNED;
    } else {
      // change token's owner
      mysteryboxTokenEntity.balance[0].account = to.toLowerCase();
    }

    await mysteryboxTokenEntity.save();

    // need to save updates in nested entities too
    await mysteryboxTokenEntity.template.save();
    await mysteryboxTokenEntity.balance[0].save();

    // mysteryboxTokenEntity.erc721Template
    //   ? await mysteryboxTokenEntity.template.save()
    //   : await mysteryboxTokenEntity.mysterybox.template.save();
  }

  public async approval(event: ILogEvent<ITokenApprove>, context: Log): Promise<void> {
    const {
      args: { tokenId },
    } = event;

    const mysteryboxTokenEntity = await this.tokenService.getToken(tokenId, context.address.toLowerCase());

    if (!mysteryboxTokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    await this.updateHistory(event, context, mysteryboxTokenEntity.id);
  }

  public async approvalForAll(event: ILogEvent<ITokenApprovedForAll>, context: Log): Promise<void> {
    await this.updateHistory(event, context);
  }

  public async unpack(event: ILogEvent<IMysteryboxUnpack>, context: Log): Promise<void> {
    const {
      args: { collection, tokenId },
    } = event;

    const contractEntity = await this.contractService.findOne({ address: collection.toLowerCase() });

    if (!contractEntity) {
      throw new NotFoundException("contractNotFound");
    }

    const TokenEntity = await this.tokenService.getToken(tokenId, context.address.toLowerCase());

    if (!TokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    await this.updateHistory(event, context, TokenEntity.id);
  }

  private async updateHistory(event: ILogEvent<TContractEventData>, context: Log, TokenId?: number) {
    this.loggerService.log(JSON.stringify(event, null, "\t"), MysteryboxServiceEth.name);

    const { args, name } = event;
    const { transactionHash, address, blockNumber } = context;

    await this.contractHistoryService.create({
      address: address.toLowerCase(),
      transactionHash: transactionHash.toLowerCase(),
      eventType: name as ContractEventType,
      eventData: args,
      // ApprovedForAll has no tokenId
      tokenId: TokenId || null,
    });

    await this.contractManagerService.updateLastBlockByAddr(
      context.address.toLowerCase(),
      parseInt(blockNumber.toString(), 16),
    );
  }
}
