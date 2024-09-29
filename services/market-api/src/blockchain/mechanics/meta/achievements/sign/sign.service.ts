import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { hexlify } from "ethers";

import type { IServerSignature } from "@ethberry/types-blockchain";
import { SettingsKeys, ClaimType } from "@framework/types";

import { SettingsService } from "../../../../../infrastructure/settings/settings.service";
import { UserEntity } from "../../../../../infrastructure/user/user.entity";
import { ClaimService } from "../../../marketing/claim/claim.service";
import { AchievementRedemptionService } from "../redemption/redemption.service";
import { AchievementLevelService } from "../level/level.service";
import { AchievementItemService } from "../item/item.service";
import type { IAchievementsSignDto } from "./interfaces";

@Injectable()
export class AchievementSignService {
  constructor(
    private readonly achievementItemService: AchievementItemService,
    private readonly achievementLevelService: AchievementLevelService,
    private readonly achievementRedemptionService: AchievementRedemptionService,
    private readonly settingsService: SettingsService,
    private readonly claimService: ClaimService,
  ) {}

  public async sign(dto: IAchievementsSignDto, userEntity: UserEntity): Promise<IServerSignature> {
    const { achievementLevelId } = dto;

    const achievementLevelEntity = await this.achievementLevelService.findOneWithRelations({ id: achievementLevelId });

    if (!achievementLevelEntity) {
      throw new NotFoundException("achievementLevelNotFound");
    }

    const count = await this.achievementItemService.count(
      {
        achievementRuleId: achievementLevelEntity.achievementRuleId,
      },
      userEntity,
    );

    if (count < achievementLevelEntity.amount) {
      throw new BadRequestException("requirementsDoesNotMeet");
    }

    const ttl = await this.settingsService.retrieveByKey<number>(SettingsKeys.SIGNATURE_TTL);

    const claimEntity = await this.claimService.create(
      {
        account: userEntity.wallet,
        item: achievementLevelEntity.reward,
        endTimestamp: new Date(0).toISOString(),
        chainId: userEntity.chainId,
        claimType: ClaimType.TEMPLATE,
      },
      userEntity,
    );

    // TODO should we create Redemption only after successful redeem?
    await this.achievementRedemptionService.create({
      userId: userEntity.id,
      achievementLevelId: achievementLevelEntity.id,
      claimId: claimEntity.id,
    });

    return {
      nonce: hexlify(claimEntity.nonce),
      signature: claimEntity.signature,
      expiresAt: ttl && ttl + Date.now() / 1000,
      bytecode: claimEntity.id.toString(),
    };
  }
}
