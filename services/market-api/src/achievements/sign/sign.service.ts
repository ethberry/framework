import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { constants, utils } from "ethers";

import type { IServerSignature } from "@gemunion/types-blockchain";
import type { IParams } from "@gemunion/nest-js-module-exchange-signer";
import { SignerService } from "@gemunion/nest-js-module-exchange-signer";
import { SettingsKeys, TokenType } from "@framework/types";

import { SettingsService } from "../../infrastructure/settings/settings.service";
import { UserEntity } from "../../infrastructure/user/user.entity";
import { AchievementItemService } from "../item/item.service";
import { ISignAchievementsDto } from "./interfaces";
import { AchievementLevelService } from "../level/level.service";
import { AchievementLevelEntity } from "../level/level.entity";

@Injectable()
export class AchievementSignService {
  constructor(
    private readonly achievementItemService: AchievementItemService,
    private readonly achievementLevelService: AchievementLevelService,
    private readonly signerService: SignerService,
    private readonly settingsService: SettingsService,
  ) {}

  public async sign(dto: ISignAchievementsDto, userEntity: UserEntity): Promise<IServerSignature> {
    const { achievementLevelId, account, referrer = constants.AddressZero } = dto;

    const achievementLevelEntity = await this.achievementLevelService.findOne(
      { id: achievementLevelId },
      {
        join: {
          alias: "achievement",
          leftJoinAndSelect: {
            item: "achievement.item",
            item_components: "item.components",
            item_template: "item_components.template",
            item_contract: "item_components.contract",
          },
        },
      },
    );

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

    const nonce = utils.randomBytes(32);
    const expiresAt = ttl && ttl + Date.now() / 1000;
    const signature = await this.getSignature(
      account,
      {
        nonce,
        externalId: achievementLevelEntity.id,
        expiresAt,
        referrer,
      },
      achievementLevelEntity,
    );

    return { nonce: utils.hexlify(nonce), signature, expiresAt };
  }

  public async getSignature(
    account: string,
    params: IParams,
    achievementLevelEntity: AchievementLevelEntity,
  ): Promise<string> {
    return this.signerService.getManyToManySignature(
      account,
      params,
      achievementLevelEntity.item.components.map(component => ({
        tokenType: Object.values(TokenType).indexOf(component.tokenType),
        token: component.contract.address,
        tokenId: component.templateId.toString(),
        amount: component.amount,
      })),
      [],
    );
  }
}
