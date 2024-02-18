import { Injectable } from "@nestjs/common";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { DataSource, DeepPartial, FindManyOptions, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { ns } from "@framework/constants";
import { ReferralRewardShareEntity } from "./referral.reward.share.entity";

export interface IRefChainQuery {
  level: number;
  wallet: string;
  share: number;
  reflen: number;
  temp: boolean;
  id: number;
}

@Injectable()
export class ReferralRewardShareService {
  constructor(
    @InjectRepository(ReferralRewardShareEntity)
    private readonly referralRewardShareEntityRepository: Repository<ReferralRewardShareEntity>,
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  public findOne(
    where: FindOptionsWhere<ReferralRewardShareEntity>,
    options?: FindOneOptions<ReferralRewardShareEntity>,
  ): Promise<ReferralRewardShareEntity | null> {
    return this.referralRewardShareEntityRepository.findOne({ where, ...options });
  }

  public findAll(
    where: FindOptionsWhere<ReferralRewardShareEntity>,
    options?: FindManyOptions<ReferralRewardShareEntity>,
  ): Promise<Array<ReferralRewardShareEntity>> {
    return this.referralRewardShareEntityRepository.find({ where, ...options });
  }

  public async create(dto: DeepPartial<ReferralRewardShareEntity>): Promise<ReferralRewardShareEntity> {
    return this.referralRewardShareEntityRepository.create(dto).save();
  }

  public async createShares(
    rewardId: number,
    merchantId: number,
    refChain: Array<IRefChainQuery>,
  ): Promise<Array<ReferralRewardShareEntity>> {
    return Promise.all(
      refChain.map(
        async chain =>
          await this.create({
            referrer: chain.wallet,
            share: chain.share,
            level: chain.level,
            treeId: chain.id,
            rewardId,
          }),
      ),
    );
  }

  public async getRefChain(referrer: string, merchantId: number): Promise<Array<IRefChainQuery>> {
    const queryRunner = this.dataSource.createQueryRunner();

    const result: Array<IRefChainQuery> = await queryRunner.query(`
        WITH RECURSIVE ref_tree AS (
            SELECT id, wallet, referral, level, merchant_id, temp, 1 as refLen
            FROM ${ns}.referral_tree
            WHERE wallet = '${referrer}'
              AND merchant_id = ${merchantId}
            UNION
            SELECT t.id, t.wallet, t.referral, t.level, t.merchant_id, t.temp, rt.refLen + 1
            FROM ${ns}.referral_tree t
                     INNER JOIN ref_tree rt ON t.merchant_id = rt.merchant_id AND t.wallet = rt.referral AND rt.level > 0
        )
        SELECT ref_tree.id, ref_tree.level, ref_tree.wallet, rp.share, ref_tree.refLen, ref_tree.temp
        FROM ref_tree
                 left join ${ns}.referral_program rp on ref_tree.merchant_id = rp.merchant_id and ref_tree.refLen = rp.level
        order by ref_tree.refLen;
    `);

    if (result && result.length > 0) {
      return result;
    } else {
      return [];
    }
  }
}
