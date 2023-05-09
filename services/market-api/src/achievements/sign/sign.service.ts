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
import { ClaimService } from "../../blockchain/mechanics/claim/claim.service";
import { AchievementRedemptionService } from "../redemption/redemption.service";

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
    const { achievementLevelId, account, referrer = constants.AddressZero } = dto;

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

    const nonce = utils.randomBytes(32);
    const expiresAt = ttl && ttl + Date.now() / 1000;
    const zeroDateTime = new Date(0).toISOString();

    const claimEntity = await this.claimService.create({
      itemId: achievementLevelEntity.itemId,
      account: account.toLowerCase(),
      endTimestamp: zeroDateTime, // TODO limit time for achievement's redeem?
      nonce: utils.hexlify(nonce),
      signature: "0x",
      merchantId: userEntity.merchantId,
    });

    await this.achievementRedemptionService.create({
      userId: userEntity.id,
      achievementLevelId: achievementLevelEntity.id,
      claimId: claimEntity.id,
    });

    const signature = await this.getSignature(
      account,
      {
        nonce,
        externalId: claimEntity.id,
        expiresAt,
        referrer,
        extra: utils.hexZeroPad(utils.hexlify(achievementLevelEntity.id), 32),
      },
      achievementLevelEntity,
    );

    await this.claimService.update(
      { id: claimEntity.id },
      {
        itemId: achievementLevelEntity.itemId,
        account: account.toLowerCase(),
        nonce: utils.hexlify(nonce),
        signature,
        merchantId: userEntity.merchantId,
      },
    );

    return { nonce: utils.hexlify(nonce), signature, expiresAt, bytecode: claimEntity.id.toString() };
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
