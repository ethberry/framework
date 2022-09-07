import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { constants, providers } from "ethers";
import { Log } from "@ethersproject/abstract-provider";

import { ETHERS_RPC, ILogEvent } from "@gemunion/nestjs-ethers";

import { IMysteryboxUnpack, ITokenTransfer, TokenAttributes, TokenStatus } from "@framework/types";

import { getMetadata } from "../../../../common/utils";

import { ABI } from "../../../tokens/erc721/token/log/interfaces";
import { ContractHistoryService } from "../../../contract-history/contract-history.service";
import { ContractService } from "../../../hierarchy/contract/contract.service";
import { TemplateService } from "../../../hierarchy/template/template.service";
import { TokenService } from "../../../hierarchy/token/token.service";
import { BalanceService } from "../../../hierarchy/balance/balance.service";
import { MysteryBoxService } from "./box.service";
import { TokenServiceEth } from "../../../hierarchy/token/token.service.eth";

@Injectable()
export class MysteryBoxServiceEth extends TokenServiceEth {
  constructor(
    @Inject(Logger)
    protected readonly loggerService: LoggerService,
    @Inject(ETHERS_RPC)
    protected readonly jsonRpcProvider: providers.JsonRpcProvider,
    protected readonly contractService: ContractService,
    protected readonly tokenService: TokenService,
    protected readonly templateService: TemplateService,
    protected readonly balanceService: BalanceService,
    protected readonly contractHistoryService: ContractHistoryService,
    protected readonly mysteryboxService: MysteryBoxService,
  ) {
    super(loggerService, contractService, tokenService, contractHistoryService);
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

    const mysteryboxTokenEntity = await this.tokenService.getToken(tokenId, address.toLowerCase());

    if (!mysteryboxTokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    await this.updateHistory(event, context, mysteryboxTokenEntity.id);

    if (from === constants.AddressZero) {
      mysteryboxTokenEntity.template.amount += 1;
      // mysteryboxTokenEntity.erc721Template
      //   ? (mysteryboxTokenEntity.template.instanceCount += 1)
      //   : (mysteryboxTokenEntity.mystery.template.instanceCount += 1);
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
    //   : await mysteryboxTokenEntity.mystery.template.save();
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
}
