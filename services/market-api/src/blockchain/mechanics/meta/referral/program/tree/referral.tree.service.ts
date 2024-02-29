import { Injectable } from "@nestjs/common";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { DataSource, FindManyOptions, FindOneOptions, FindOptionsWhere, In, Repository } from "typeorm";

import { UserEntity } from "../../../../../../infrastructure/user/user.entity";
import { ReferralTreeEntity } from "./referral.tree.entity";
import { IReferralTreeSearchDto } from "./interfaces";
import { ReferralProgramStatus } from "@framework/types";

export interface IRefTreeMerchantAutocomplete {
  merchantId: number;
  merchantTitle: string;
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
  ): Promise<[Array<ReferralTreeEntity>, number]> {
    const { merchantIds /*, skip, take */ } = dto;
    const { wallet } = userEntity;

    const userRefEntities = await this.findAll(merchantIds ? { wallet, merchantId: In(merchantIds) } : { wallet }, {
      relations: { merchant: { refLevels: true } },
    });
    // FILTER ONLY ACTIVE REF PROGRAMS
    const activeRefEntities = userRefEntities.filter(
      ref =>
        ref.merchant.refLevels.filter(lev => lev.referralProgramStatus === ReferralProgramStatus.ACTIVE).length > 1,
    );
    // Just in case - should never happen =)
    const uniqueMerchants = [...new Set(activeRefEntities)];
    const treeArrResponse = [];
    for (const entity of uniqueMerchants) {
      const tree = await this.dataSource.manager
        .getTreeRepository(ReferralTreeEntity)
        .findDescendantsTree(entity, { relations: ["merchant", "parent" /*, "merchant.refLevels" */] });

      // ADD ONLY IF CHILDRENS EXISTS
      if (tree && tree.children.length > 0) {
        treeArrResponse.push(tree);
      }
    }

    // TODO  take\skip logic
    if (treeArrResponse && treeArrResponse.length > 0) {
      return [treeArrResponse, treeArrResponse.length];
    } else {
      return [[], 0];
    }
  }

  public async autocomplete(userEntity: UserEntity): Promise<Array<IRefTreeMerchantAutocomplete>> {
    const queryBuilder = this.referralTreeEntityRepository.createQueryBuilder("program");
    queryBuilder.select(["merchant.id as id", "merchant.title as title"]);
    queryBuilder.andWhere("program.referral = :referral", { referral: userEntity.wallet });
    queryBuilder.leftJoin("program.merchant", "merchant");
    queryBuilder.leftJoin("merchant.refLevels", "levels");
    // LOOK ONLY FOR MERCHANTS WITH ACTIVE PROGRAM
    queryBuilder.andWhere("levels.referralProgramStatus = :referralProgramStatus", {
      referralProgramStatus: ReferralProgramStatus.ACTIVE,
    });

    queryBuilder.groupBy("merchant.id, merchant.title");

    return await queryBuilder.getRawMany();
  }
}
