import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, FindManyOptions, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { ReferralTreeEntity } from "./referral.tree.entity";

@Injectable()
export class ReferralTreeService {
  constructor(
    @InjectRepository(ReferralTreeEntity)
    private readonly referralTreeEntityRepository: Repository<ReferralTreeEntity>,
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

  public async create(dto: DeepPartial<ReferralTreeEntity>): Promise<ReferralTreeEntity> {
    return this.referralTreeEntityRepository.create(dto).save();
  }
}
