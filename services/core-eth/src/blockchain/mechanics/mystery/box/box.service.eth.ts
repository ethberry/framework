import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { constants, providers } from "ethers";
import { Log } from "@ethersproject/abstract-provider";

import { ETHERS_RPC, ILogEvent } from "@gemunion/nestjs-ethers";
import { IERC721TokenTransferEvent, IMysteryUnpackEvent, TokenMetadata, TokenStatus } from "@framework/types";

import { getMetadata } from "../../../../common/utils";
import { ABI } from "../../../tokens/erc721/token/log/interfaces";
import { ContractService } from "../../../hierarchy/contract/contract.service";
import { TemplateService } from "../../../hierarchy/template/template.service";
import { TokenService } from "../../../hierarchy/token/token.service";
import { BalanceService } from "../../../hierarchy/balance/balance.service";
import { TokenServiceEth } from "../../../hierarchy/token/token.service.eth";
import { EventHistoryService } from "../../../event-history/event-history.service";
import { AssetService } from "../../../exchange/asset/asset.service";
import { MysteryBoxService } from "./box.service";

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
    protected readonly assetService: AssetService,
    protected readonly eventHistoryService: EventHistoryService,
    protected readonly mysteryboxService: MysteryBoxService,
  ) {
    super(loggerService, tokenService, eventHistoryService);
  }

  public async transfer(event: ILogEvent<IERC721TokenTransferEvent>, context: Log): Promise<void> {
    const {
      args: { from, to, tokenId },
    } = event;
    const { address, transactionHash } = context;

    const contractEntity = await this.contractService.findOne({ address: address.toLowerCase() });

    if (!contractEntity) {
      throw new NotFoundException("contractNotFound");
    }

    // Mint token create
    if (from === constants.AddressZero) {
      const metadata = await getMetadata(tokenId, address, ABI, this.jsonRpcProvider);
      const templateId = ~~metadata[TokenMetadata.TEMPLATE_ID];
      const mysteryboxEntity = await this.mysteryboxService.findOne({ templateId });

      if (!mysteryboxEntity) {
        throw new NotFoundException("mysteryboxNotFound");
      }

      const templateEntity = await this.templateService.findOne({ id: mysteryboxEntity.templateId });

      if (!templateEntity) {
        throw new NotFoundException("templateNotFound");
      }

      const tokenEntity = await this.tokenService.create({
        tokenId,
        metadata: JSON.stringify(metadata),
        royalty: contractEntity.royalty,
        template: templateEntity,
      });

      await this.balanceService.increment(tokenEntity.id, to.toLowerCase(), "1");
      await this.assetService.updateAssetHistory(transactionHash, tokenEntity.id);
    }

    const mysteryboxTokenEntity = await this.tokenService.getToken(tokenId, address.toLowerCase());

    if (!mysteryboxTokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    await this.eventHistoryService.updateHistory(event, context, mysteryboxTokenEntity.id);

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

  public async unpack(event: ILogEvent<IMysteryUnpackEvent>, context: Log): Promise<void> {
    const {
      args: { tokenId },
    } = event;
    const { address } = context;

    const tokenEntity = await this.tokenService.getToken(tokenId, address.toLowerCase());

    if (!tokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    await this.eventHistoryService.updateHistory(event, context, tokenEntity.id);
  }
}
