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

  public async createIfNotExist(data: {
    merchantId: number;
    wallet: string;
    referral: string;
    level: number;
    temp: boolean;
  }): Promise<void> {
    const { merchantId, wallet, referral, level, temp } = data;
    const entity = await this.findOne({ merchantId, wallet, referral, level, temp });
    if (!entity) {
      await this.create({ merchantId, wallet, referral, level, temp });
    }
  }

  public async deleteIfExist(where: FindOptionsWhere<ReferralTreeEntity>): Promise<void> {
    const entity = await this.findOne(where);
    if (entity) {
      await entity.remove();
    }
  }

  public async updateIfExist(
    where: FindOptionsWhere<ReferralTreeEntity>,
    dto: DeepPartial<ReferralTreeEntity>,
  ): Promise<ReferralTreeEntity | null> {
    const entity = await this.findOne(where);
    if (entity) {
      return Object.assign(entity, dto).save();
    } else return null;
  }
}
