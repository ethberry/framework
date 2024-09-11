import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, FindManyOptions, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import { comparator } from "@gemunion/utils";
import type { IReferralProgramCreateDto, IReferralProgramUpdateDto } from "@framework/types";

import { UserEntity } from "../../../../../infrastructure/user/user.entity";
import { MerchantService } from "../../../../../infrastructure/merchant/merchant.service";
import { ReferralProgramEntity } from "./referral.program.entity";

@Injectable()
export class ReferralProgramService {
  constructor(
    @InjectRepository(ReferralProgramEntity)
    private readonly referralProgramEntityRepository: Repository<ReferralProgramEntity>,
    protected readonly merchantService: MerchantService,
  ) {}

  public async search(userEntity: UserEntity): Promise<[Array<ReferralProgramEntity>, number]> {
    const queryBuilder = this.referralProgramEntityRepository.createQueryBuilder("program");

    queryBuilder.leftJoinAndSelect("program.merchant", "merchant");

    queryBuilder.select();

    queryBuilder.andWhere("program.merchantId = :merchantId", {
      merchantId: userEntity.merchantId,
    });

    queryBuilder.orderBy({
      "program.level": "ASC",
    });

    return queryBuilder.getManyAndCount();
  }

  public findOne(
    where: FindOptionsWhere<ReferralProgramEntity>,
    options?: FindOneOptions<ReferralProgramEntity>,
  ): Promise<ReferralProgramEntity | null> {
    return this.referralProgramEntityRepository.findOne({ where, ...options });
  }

  public findAll(
    where: FindOptionsWhere<ReferralProgramEntity>,
    options?: FindManyOptions<ReferralProgramEntity>,
  ): Promise<Array<ReferralProgramEntity>> {
    return this.referralProgramEntityRepository.find({ where, ...options });
  }

  public async create(dto: DeepPartial<ReferralProgramEntity>): Promise<ReferralProgramEntity> {
    return this.referralProgramEntityRepository.create(dto).save();
  }

  public async findAllWithRelations(userEntity: UserEntity): Promise<Array<ReferralProgramEntity>> {
    return this.findAll({ merchantId: userEntity.merchantId }, { relations: { merchant: true } });
  }

  public async createRefProgram(
    dto: IReferralProgramCreateDto,
    userEntity: UserEntity,
  ): Promise<ReferralProgramEntity[]> {
    const { levels } = dto;

    if (levels.length > 0) {
      // CREATE ALL REF PROGRAM LEVELS
      for (const level of levels.sort(comparator("level"))) {
        await this.create({
          merchantId: userEntity.merchantId,
          level: level.level,
          share: level.share,
        });
      }
    }

    return this.findAllWithRelations(userEntity);
  }

  public async update(dto: IReferralProgramUpdateDto, userEntity: UserEntity): Promise<ReferralProgramEntity[]> {
    const { levels, referralProgramStatus } = dto;

    if (levels?.length) {
      // REMOVE OLD
      await this.deleteProgram(userEntity.merchantId);
      // CREATE NEW
      await this.createRefProgram({ levels }, userEntity);
    }

    if (referralProgramStatus) {
      const refLevels = await this.findAll({ merchantId: userEntity.merchantId });
      for (const level of refLevels) {
        Object.assign(level, { referralProgramStatus });
        await level.save();
      }
    }

    return this.findAllWithRelations(userEntity);
  }

  public async deleteProgram(merchantId: number): Promise<void> {
    const programLevels = await this.findAll({ merchantId });
    if (programLevels && programLevels.length > 0) {
      await Promise.all(programLevels.map(level => level.remove()));
    }
  }
}
