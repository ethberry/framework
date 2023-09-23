import { Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { Log } from "ethers";

import type { ILogEvent } from "@gemunion/nest-js-module-ethers-gcp";
import type { IExchangeGradeEvent } from "@framework/types";

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
      args: { externalId, attribute, item, price },
    } = event;
    const { transactionHash, address } = context;

    const { tokenType, token, tokenId, amount } = item;

    const tokenEntity = await this.tokenService.getToken(tokenId, token.toLowerCase());

    if (!tokenEntity) {
      this.loggerService.error("tokenNotFound", tokenId, token.toLowerCase(), ExchangeGradeServiceEth.name);
      throw new NotFoundException("tokenNotFound");
    }

    const history = await this.eventHistoryService.updateHistory(event, context, tokenEntity.id);

    const assets = await this.assetService.saveAssetHistory(
      history,
      // we have to change tokenId to templateId for proper asset history
      [{ tokenType, token, tokenId: tokenEntity.template.id.toString(), amount }],
      price,
    );

    await this.assetService.updateAssetHistory(transactionHash, tokenEntity);

    const gradeEntity = await this.gradeService.findOneWithRelations({ id: Number(externalId) });
    if (!gradeEntity) {
      this.loggerService.error("gradeNotFound", tokenEntity.id, attribute, ExchangeGradeServiceEth.name);
      throw new NotFoundException("gradeNotFound");
    }

    await this.notificatorService.grade({
      grade: gradeEntity,
      token: tokenEntity,
      price: assets.price,
      address,
      transactionHash,
    });

    // await this.openSeaService.metadataUpdate(tokenEntity);
  }
}
