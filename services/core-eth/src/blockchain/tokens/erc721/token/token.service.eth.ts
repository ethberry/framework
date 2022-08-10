import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { constants, providers } from "ethers";
import { Log } from "@ethersproject/abstract-provider";
import { ETHERS_RPC, ILogEvent } from "@gemunion/nestjs-ethers";

import {
  ContractEventType,
  IRandomRequest,
  ITokenApprove,
  ITokenApprovedForAll,
  ITokenMintRandom,
  ITokenTransfer,
  TContractEventData,
  TokenAttributes,
  TokenRarity,
  TokenStatus,
} from "@framework/types";

import { getMetadata } from "../../../../common/utils";
import { ContractHistoryService } from "../../../contract-history/contract-history.service";
import { ContractManagerService } from "../../../contract-manager/contract-manager.service";
import { ContractService } from "../../../hierarchy/contract/contract.service";
import { TemplateService } from "../../../hierarchy/template/template.service";
import { TokenService } from "../../../hierarchy/token/token.service";
import { BalanceService } from "../../../hierarchy/balance/balance.service";
import { ABI } from "./token-log/interfaces";

@Injectable()
export class Erc721TokenServiceEth {
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
  ) {}

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
      const templateEntity = await this.templateService.findOne({ id: templateId });

      if (!templateEntity) {
        throw new NotFoundException("templateNotFound");
      }

      const tokenEntity = await this.tokenService.create({
        tokenId,
        attributes: JSON.stringify(attributes),
        royalty: contractEntity.royalty,
        templateId: templateEntity.id,
      });

      await this.balanceService.increment(tokenEntity.id, from.toLowerCase(), "1");
    }

    const erc721TokenEntity = await this.tokenService.getToken(tokenId, context.address.toLowerCase());

    if (!erc721TokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    await this.updateHistory(event, context, erc721TokenEntity.id);

    if (from === constants.AddressZero) {
      erc721TokenEntity.template.amount += 1;
      // erc721TokenEntity.erc721Template
      //   ? (erc721TokenEntity.erc721Template.instanceCount += 1)
      //   : (erc721TokenEntity.erc721Mysterybox.erc721Template.instanceCount += 1);
      erc721TokenEntity.tokenStatus = TokenStatus.MINTED;
    } else if (to === constants.AddressZero) {
      // erc721TokenEntity.erc721Template.instanceCount -= 1;
      erc721TokenEntity.tokenStatus = TokenStatus.BURNED;
    } else {
      // change token's owner
      erc721TokenEntity.balance[0].account = to.toLowerCase();
    }

    await erc721TokenEntity.save();

    // need to save updates in nested entities too
    await erc721TokenEntity.template.save();
    await erc721TokenEntity.balance[0].save();
    // erc721TokenEntity.erc721Template

    //   ? await erc721TokenEntity.template.save()
    //   : await erc721TokenEntity.mysterybox.template.save();
  }

  public async approval(event: ILogEvent<ITokenApprove>, context: Log): Promise<void> {
    const {
      args: { tokenId },
    } = event;

    const tokenEntity = await this.tokenService.getToken(tokenId, context.address.toLowerCase());

    if (!tokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    await this.updateHistory(event, context, tokenEntity.id);
  }

  public async approvalForAll(event: ILogEvent<ITokenApprovedForAll>, context: Log): Promise<void> {
    await this.updateHistory(event, context);
  }

  public async mintRandom(event: ILogEvent<ITokenMintRandom>, context: Log): Promise<void> {
    const {
      args: { to, tokenId, templateId, rarity, mysteryboxId },
    } = event;

    const templateEntity = await this.templateService.findOne({ id: ~~templateId });

    if (!templateEntity) {
      throw new NotFoundException("templateNotFound");
    }

    let mysteryboxEntity; // if minted as Mechanics reward
    if (~~mysteryboxId !== 0) {
      mysteryboxEntity = await this.tokenService.findOne({ id: ~~mysteryboxId });

      if (!mysteryboxEntity) {
        throw new NotFoundException("mysteryboxNotFound");
      }
    }

    const tokenEntity = await this.tokenService.create({
      tokenId,
      attributes: JSON.stringify({
        rarity: Object.values(TokenRarity)[~~rarity],
      }),
      royalty: templateEntity.contract.royalty,
      template: templateEntity,
      // erc721Token: mysteryboxEntity,
    });

    await this.balanceService.create({
      account: to.toLowerCase(),
      amount: "1",
      tokenId: tokenEntity.id,
    });

    await this.updateHistory(event, context, tokenEntity.id);
  }

  public async randomRequest(event: ILogEvent<IRandomRequest>, context: Log): Promise<void> {
    await this.updateHistory(event, context);
  }

  private async updateHistory(event: ILogEvent<TContractEventData>, context: Log, erc721TokenId?: number) {
    this.loggerService.log(JSON.stringify(event, null, "\t"), Erc721TokenServiceEth.name);

    const { args, name } = event;
    const { transactionHash, address, blockNumber } = context;

    await this.contractHistoryService.create({
      address: address.toLowerCase(),
      transactionHash: transactionHash.toLowerCase(),
      eventType: name as ContractEventType,
      eventData: args,
      // ApprovedForAll has no tokenId
      tokenId: erc721TokenId || null,
    });

    await this.contractManagerService.updateLastBlockByAddr(
      context.address.toLowerCase(),
      parseInt(blockNumber.toString(), 16),
    );
  }
}
