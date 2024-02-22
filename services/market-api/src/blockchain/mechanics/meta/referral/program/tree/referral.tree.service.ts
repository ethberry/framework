import { Injectable } from "@nestjs/common";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { DataSource, FindManyOptions, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { ns } from "@framework/constants";

import { UserEntity } from "../../../../../../infrastructure/user/user.entity";
import { ReferralTreeEntity } from "./referral.tree.entity";
import { IReferralTreeSearchDto } from "./interfaces";

export interface IReferralChain {
  id: number;
  merchant: string;
  wallet: string;
  reflen: number;
  share: number;
}

@Injectable()
export class ReferralTreeService {
  constructor(
    @InjectRepository(ReferralTreeEntity)
    private readonly referralTreeEntityRepository: Repository<ReferralTreeEntity>,
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  public findOne(
    where: FindOptionsWhere<ReferralTreeEntity>,
    options?: FindOneOptions<ReferralTreeEntity>,
  ): Promise<ReferralTreeEntity | null> {
    return this.referralTreeEntityRepository.findOne({ where, ...options });
  }

  public findAll(
    where: FindOptionsWhere<ReferralTreeEntity>,
    options?: FindManyOptions<ReferralTreeEntity>,
  ): Promise<Array<ReferralTreeEntity>> {
    return this.referralTreeEntityRepository.find({ where, ...options });
  }

  public async getReferralTree(
    dto: IReferralTreeSearchDto,
    userEntity: UserEntity,
  ): Promise<[Array<IReferralChain>, number]> {
    const { merchantIds, skip, take } = dto;
    const { wallet } = userEntity;
    const queryRunner = this.dataSource.createQueryRunner();

    // const tree = await this.dataSource.manager.getTreeRepository(ReferralTreeEntity).findTrees();
    // console.log("TREE-TREE", tree);

    const whereCondition = merchantIds
      ? `WHERE ref_tree.refLen > 0 AND ref_tree.merchant_id = ANY(ARRAY[${merchantIds.join(",")}])`
      : "WHERE ref_tree.refLen > 0";

    const allCount = await queryRunner.query(`
            WITH RECURSIVE ref_tree AS (
            SELECT id, wallet, referral, merchant_id, 0 as refLen
            FROM ${ns}.referral_tree
            WHERE wallet = '${wallet}'
            UNION
            SELECT t.id, t.wallet, t.referral, t.merchant_id, rt.refLen
            FROM ${ns}.referral_tree t
                     INNER JOIN ref_tree rt ON t.merchant_id = rt.merchant_id AND t.referral = rt.wallet
        )
        SELECT COUNT(DISTINCT(ref_tree.id)) AS "cnt"
        FROM ref_tree
        WHERE ref_tree.referral <> '0x0000000000000000000000000000000000000000'
    `);

    const result: Array<IReferralChain> = await queryRunner.query(`
        WITH RECURSIVE ref_tree AS (
            SELECT id, wallet, referral, merchant_id, 0 as refLen
            FROM ${ns}.referral_tree
            WHERE wallet = '${wallet}'
            UNION
            SELECT t.id, t.wallet, t.referral, t.merchant_id, rt.refLen + 1
            FROM ${ns}.referral_tree t
                     INNER JOIN ref_tree rt ON t.merchant_id = rt.merchant_id AND t.referral = rt.wallet
        )
        SELECT ref_tree.id, m.title as merchant, ref_tree.wallet, ref_tree.refLen, rp.share
        FROM ref_tree
                 LEFT JOIN ${ns}.referral_program rp ON ref_tree.merchant_id = rp.merchant_id AND ref_tree.refLen = rp.level
                 LEFT JOIN ${ns}.merchant m ON ref_tree.merchant_id = m.id
        ${whereCondition}
        ORDER BY ref_tree.merchant_id, ref_tree.refLen
        LIMIT ${take} OFFSET ${skip} ;
    `);

    if (result && result.length > 0 && allCount && allCount.length > 0) {
      return [result, allCount[0].cnt];
    } else {
      return [[], 0];
    }
  }
}