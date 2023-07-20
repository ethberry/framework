import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { JsonRpcProvider, Log, ZeroAddress } from "ethers";

import { ETHERS_RPC, ILogEvent } from "@gemunion/nestjs-ethers";
import { IERC721TokenTransferEvent, IUnpackMysteryBoxEvent, TokenMetadata, TokenStatus } from "@framework/types";

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
import { NotificatorService } from "../../../../game/notificator/notificator.service";

@Injectable()
export class MysteryBoxServiceEth extends TokenServiceEth {
  constructor(
    @Inject(Logger)
    protected readonly loggerService: LoggerService,
    @Inject(ETHERS_RPC)
    protected readonly jsonRpcProvider: JsonRpcProvider,
    protected readonly contractService: ContractService,
    protected readonly tokenService: TokenService,
    protected readonly templateService: TemplateService,
    protected readonly balanceService: BalanceService,
    protected readonly assetService: AssetService,
    protected readonly eventHistoryService: EventHistoryService,
    protected readonly mysteryBoxService: MysteryBoxService,
    protected readonly notificatorService: NotificatorService,
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
    if (from === ZeroAddress) {
      const metadata = await getMetadata(tokenId, address, ABI, this.jsonRpcProvider, this.loggerService);
      const templateId = ~~metadata[TokenMetadata.TEMPLATE_ID];
      const mysteryBoxEntity = await this.mysteryBoxService.findOne({ templateId });

      if (!mysteryBoxEntity) {
        throw new NotFoundException("mysteryBoxNotFound");
      }

      const templateEntity = await this.templateService.findOne({ id: mysteryBoxEntity.templateId });

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

    const mysteryBoxTokenEntity = await this.tokenService.getToken(
      Number(tokenId).toString(),
      address.toLowerCase(),
      void 0,
      true,
    );

    if (!mysteryBoxTokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    await this.eventHistoryService.updateHistory(event, context, mysteryBoxTokenEntity.id);

    if (from === ZeroAddress) {
      mysteryBoxTokenEntity.template.amount += 1;
      // mysteryBoxTokenEntity.erc721Template
      //   ? (mysteryBoxTokenEntity.template.instanceCount += 1)
      //   : (mysteryBoxTokenEntity.mystery.template.instanceCount += 1);
      mysteryBoxTokenEntity.tokenStatus = TokenStatus.MINTED;
    } else if (to === ZeroAddress) {
      // mysteryBoxTokenEntity.erc721Template.instanceCount -= 1;
      mysteryBoxTokenEntity.tokenStatus = TokenStatus.BURNED;
    } else {
      // change token's owner
      mysteryBoxTokenEntity.balance[0].account = to.toLowerCase();
    }

    await mysteryBoxTokenEntity.save();

    // need to save updates in nested entities too
    await mysteryBoxTokenEntity.template.save();
    await mysteryBoxTokenEntity.balance[0].save();

    // mysteryBoxTokenEntity.erc721Template
    //   ? await mysteryBoxTokenEntity.template.save()
    //   : await mysteryBoxTokenEntity.mystery.template.save();
  }

  public async unpack(event: ILogEvent<IUnpackMysteryBoxEvent>, context: Log): Promise<void> {
    const {
      args: { account, tokenId },
    } = event;
    const { address, transactionHash } = context;

    const tokenEntity = await this.tokenService.getToken(tokenId, account.toLowerCase());

    if (!tokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    const history = await this.eventHistoryService.updateHistory(event, context, tokenEntity.id);

    const assets = await this.assetService.saveAssetHistory(history, [], []);

    await this.notificatorService.unpackMystery({
      ...assets,
      address,
      transactionHash,
    });
  }
}
