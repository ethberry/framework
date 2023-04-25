import { Injectable, NotFoundException } from "@nestjs/common";
import { Log } from "@ethersproject/abstract-provider";
import { utils } from "ethers";

import type { ILogEvent } from "@gemunion/nestjs-ethers";
import { ClaimStatus, IExchangeClaimEvent } from "@framework/types";

import { ClaimService } from "../../mechanics/claim/claim.service";
import { AssetService } from "../asset/asset.service";
import { EventHistoryService } from "../../event-history/event-history.service";
import { AchievementLevelService } from "../../../achievements/level/level.service";
import { UserService } from "../../../infrastructure/user/user.service";
import { NotificatorService } from "../../../game/notificator/notificator.service";

@Injectable()
export class ExchangeClaimServiceEth {
  constructor(
    private readonly claimService: ClaimService,
    private readonly assetService: AssetService,
    private readonly achievementLevelService: AchievementLevelService,
    private readonly userService: UserService,
    private readonly eventHistoryService: EventHistoryService,
    private readonly notificatorService: NotificatorService,
  ) {}

  public async claim(event: ILogEvent<IExchangeClaimEvent>, context: Log): Promise<void> {
    const {
      args: { claimData, items, externalId, from },
    } = event;
    const history = await this.eventHistoryService.updateHistory(event, context);
    const zeroData = utils.formatBytes32String("0x"); // TODO move to const?

    const claimEntity = await this.claimService.findOne({ id: ~~externalId });

    if (!claimEntity) {
      throw new NotFoundException("claimNotFound");
    }

    Object.assign(claimEntity, { claimStatus: ClaimStatus.REDEEMED });
    await claimEntity.save();

    // MODULE:ACHIEVEMENT
    if (claimData !== zeroData) {
      const levelId = utils.hexStripZeros(claimData);
      const achievementLevelEntity = await this.achievementLevelService.findOneWithRelations({ id: ~~levelId });

      if (!achievementLevelEntity) {
        throw new NotFoundException("achievementLevelNotFound");
      }

      const userEntity = await this.userService.findOne({ wallet: from.toLowerCase() });

      if (!userEntity) {
        throw new NotFoundException("userNotFound");
      }

      await this.achievementRedemptionService.create({});
      this.notificatorService.dummyUser({ userId: userEntity.id, achievementLevelId: achievementLevelEntity.id });
    }

    await this.assetService.saveAssetHistory(history, items, []);
  }
}
