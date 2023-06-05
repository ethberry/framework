import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { hexlify } from "ethers";

import type { IServerSignature } from "@gemunion/types-blockchain";
import type { IParams } from "@gemunion/nest-js-module-exchange-signer";
import { SignerService } from "@gemunion/nest-js-module-exchange-signer";
import { SettingsKeys, TokenType } from "@framework/types";

import { SettingsService } from "../../infrastructure/settings/settings.service";
import { UserEntity } from "../../infrastructure/user/user.entity";
import { ClaimService } from "../../blockchain/mechanics/claim/claim.service";
import { AchievementRedemptionService } from "../redemption/redemption.service";
import { AchievementLevelService } from "../level/level.service";
import { AchievementItemService } from "../item/item.service";
import { AchievementLevelEntity } from "../level/level.entity";
import type { ISignAchievementsDto } from "./interfaces";

@Injectable()
export class AchievementSignService {
  constructor(
    private readonly achievementItemService: AchievementItemService,
    private readonly achievementLevelService: AchievementLevelService,
    private readonly achievementRedemptionService: AchievementRedemptionService,
    private readonly signerService: SignerService,
    private readonly settingsService: SettingsService,
    private readonly claimService: ClaimService,
  ) {}

  public async sign(dto: ISignAchievementsDto, userEntity: UserEntity): Promise<IServerSignature> {
    const { achievementLevelId, account } = dto;

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
        account: account.toLowerCase(),
        item: achievementLevelEntity.item,
        endTimestamp: new Date(0).toISOString(),
      },
      userEntity,
    );

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
        tokenId:
          component.contract.contractType === TokenType.ERC1155
            ? component.template.tokens[0].tokenId
            : (component.templateId || 0).toString(), // suppression types check with 0
        amount: component.amount,
      })),
      [],
    );
  }
}
