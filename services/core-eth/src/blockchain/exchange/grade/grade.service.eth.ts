import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { Log } from "@ethersproject/abstract-provider";

import type { ILogEvent } from "@gemunion/nestjs-ethers";
import { GradeAttribute, IExchangeGradeEvent } from "@framework/types";

import { NotificatorService } from "../../../game/notificator/notificator.service";
import { EventHistoryService } from "../../event-history/event-history.service";
import { TokenService } from "../../hierarchy/token/token.service";
import { OpenSeaService } from "../../integrations/opensea/opensea.service";
import { GradeService } from "../../mechanics/grade/grade.service";
import { AssetService } from "../asset/asset.service";

@Injectable()
export class ExchangeGradeServiceEth {
  constructor(
    @Inject(Logger)
    protected readonly loggerService: LoggerService,
    private readonly tokenService: TokenService,
    private readonly openSeaService: OpenSeaService,
    private readonly assetService: AssetService,
    private readonly gradeService: GradeService,
    private readonly eventHistoryService: EventHistoryService,
    private readonly notificatorService: NotificatorService,
  ) {}

  public async upgrade(event: ILogEvent<IExchangeGradeEvent>, context: Log): Promise<void> {
    const {
      args: { item, price, from },
    } = event;
    const { transactionHash } = context;

    const [itemType, itemTokenAddr, itemTokenId, itemAmount] = item;

    const tokenEntity = await this.tokenService.getToken(itemTokenId, itemTokenAddr.toLowerCase());

    if (!tokenEntity) {
      this.loggerService.error("tokenNotFound", itemTokenId, itemTokenAddr.toLowerCase(), ExchangeGradeServiceEth.name);
      throw new NotFoundException("tokenNotFound");
    }

    const history = await this.eventHistoryService.updateHistory(event, context, tokenEntity.id);
    await this.assetService.saveAssetHistory(
      history,
      // we have to change tokenId to templateId for proper asset history
      [[itemType, itemTokenAddr, tokenEntity.template.id.toString(), itemAmount]],
      price,
    );
    await this.assetService.updateAssetHistory(transactionHash, tokenEntity.id);

    const gradeEntity = await this.gradeService.findOneByToken(tokenEntity, GradeAttribute.GRADE);

    if (!gradeEntity) {
      this.loggerService.error("gradeNotFound", tokenEntity.id, GradeAttribute.GRADE, ExchangeGradeServiceEth.name);
      throw new NotFoundException("gradeNotFound");
    }

    // Notify about Grade
    this.notificatorService.grade({
      account: from,
      tokenId: itemTokenId,
      gradeType: gradeEntity.attribute,
      transactionHash,
    });

    // await this.openSeaService.metadataUpdate(tokenEntity);
  }
}
