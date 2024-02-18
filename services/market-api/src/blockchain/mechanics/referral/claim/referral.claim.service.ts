import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import { ClaimType, IAssetComponentDto, TokenType } from "@framework/types";

import { UserEntity } from "../../../../infrastructure/user/user.entity";
import { ReferralRewardService } from "../reward/reward.service";
import { ReferralClaimEntity } from "./referral.claim.entity";
import { AssetService } from "../../../exchange/asset/asset.service";
import { ClaimService } from "../../claim/claim.service";

@Injectable()
export class ReferralClaimService {
  constructor(
    @InjectRepository(ReferralClaimEntity)
    private readonly referralClaimEntityRepository: Repository<ReferralClaimEntity>,
    private readonly referralRewardService: ReferralRewardService,
    private readonly assetService: AssetService,
    private readonly claimService: ClaimService,
  ) {}

  public async search(
    where: FindOptionsWhere<ReferralClaimEntity>,
    userEntity: UserEntity,
  ): Promise<[Array<ReferralClaimEntity>, number]> {
    const queryBuilder = this.referralClaimEntityRepository.createQueryBuilder("ref_claim");

    queryBuilder.select();

    queryBuilder.leftJoinAndSelect("ref_claim.refTree", "refTree");
    queryBuilder.leftJoinAndSelect("ref_claim.claim", "claim");
    queryBuilder.leftJoinAndSelect("ref_claim.claim", "claim");
    queryBuilder.leftJoinAndSelect("claim.item", "item");
    queryBuilder.leftJoinAndSelect("item.components", "item_components");
    queryBuilder.leftJoinAndSelect("item_components.template", "item_template");
    queryBuilder.leftJoinAndSelect("item_components.contract", "item_contract");

    queryBuilder.leftJoinAndSelect("ref_claim.refEvent", "refEvent");
    queryBuilder.leftJoinAndSelect("refEvent.price", "price");
    queryBuilder.leftJoinAndSelect("price.components", "price_components");
    queryBuilder.leftJoinAndSelect("price_components.template", "price_template");
    queryBuilder.leftJoinAndSelect("price_components.contract", "price_contract");
    queryBuilder.leftJoinAndSelect("price_components.token", "price_token");

    queryBuilder.andWhere("refTree.referral = :referral", {
      referral: userEntity.wallet,
    });

    queryBuilder.andWhere(where);

    // if (startTimestamp && endTimestamp) {
    //   queryBuilder.andWhere("reward.createdAt >= :startTimestamp AND reward.createdAt < :endTimestamp", {
    //     startTimestamp,
    //     endTimestamp,
    //   });
    // }
    //
    // if (query) {
    //   queryBuilder.andWhere("reward.referrer ILIKE '%' || :referrer || '%'", { referrer: query });
    // }
    //
    // queryBuilder.skip(skip);
    // queryBuilder.take(take);

    return queryBuilder.getManyAndCount();
  }

  public findOne(
    where: FindOptionsWhere<ReferralClaimEntity>,
    options?: FindOneOptions<ReferralClaimEntity>,
  ): Promise<ReferralClaimEntity | null> {
    return this.referralClaimEntityRepository.findOne({ where, ...options });
  }

  public create(dto: DeepPartial<ReferralClaimEntity>): Promise<ReferralClaimEntity> {
    return this.referralClaimEntityRepository.create(dto).save();
  }

  public async createRefClaims(userEntity: UserEntity): Promise<ReferralClaimEntity | null> {
    const { wallet } = userEntity;

    const [refEvents, count] = await this.referralRewardService.search(
      // { merchantIds: [userEntity.merchantId] },
      {},
      userEntity,
      true,
    );

    if (count > 0) {
      // GET MERCHANTS LIST
      const merchantIds = [...new Set(refEvents.map(event => event.merchantId))];

      for (const merchantId of merchantIds) {
        // FILTER EVENTS BY MERCHANT
        const eventsByMerchant = refEvents.filter(event => event.merchantId === merchantId);

        // GET CURRENT CHAIN-ID
        const { chainId } = eventsByMerchant[0].contract;

        // CREATE EMPTY ASSET
        const rewardClaimAssetEntity = await this.assetService.create();

        // CREATE EMPTY CLAIM
        const claimEntity = await this.claimService.createEmpty(
          wallet,
          userEntity.merchantId,
          rewardClaimAssetEntity.id,
          ClaimType.TOKEN,
        );

        // CREATE EMPTY REF CLAIM
        const newRefClaim = await this.create({ account: wallet, claimId: claimEntity.id });

        let rewardClaimComponents: Array<IAssetComponentDto> = [];

        for (const event of eventsByMerchant) {
          const { price, shares /* referrer, merchantId, */ } = event;
          const { share } = shares[0];
          const { components } = price;
          const shareableComponents = components.filter(
            comp => comp.tokenType === TokenType.NATIVE || comp.tokenType === TokenType.ERC20,
          );

          if (shareableComponents.length > 0) {
            const sharedComponents = shareableComponents.map(comp => ({
              tokenType: comp.tokenType,
              contractId: comp.contractId,
              templateId: comp.templateId,
              tokenId: comp.tokenId || null,
              amount: ((BigInt(comp.amount) / BigInt(10000)) * BigInt(share)).toString(),
            }));
            rewardClaimComponents = rewardClaimComponents.concat(sharedComponents);
          }

          // UPDATE REF REWARD SHARES
          for (const shareEntity of shares) {
            await Object.assign(shareEntity, { claimId: newRefClaim.id }).save();
          }
        }

        // COMPACT ASSET COMPONENTS
        const compactedComponents = this.assetService.summarize(rewardClaimComponents);

        // UPDATE ASSET
        await this.assetService.update(rewardClaimAssetEntity, { components: compactedComponents });

        // UPDATE CLAIM
        const updDto = {
          account: wallet,
          item: rewardClaimAssetEntity,
          endTimestamp: new Date(0).toISOString(),
          chainId,
        };
        await this.claimService.update({ id: claimEntity.id }, updDto, userEntity);
      }
    }

    return null;
  }
}
