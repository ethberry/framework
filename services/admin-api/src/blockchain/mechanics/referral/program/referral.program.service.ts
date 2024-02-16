import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindManyOptions, FindOneOptions, FindOptionsWhere, Repository, DeepPartial } from "typeorm";

import { UserRole } from "@framework/types";

import { UserEntity } from "../../../../infrastructure/user/user.entity";
import { MerchantService } from "../../../../infrastructure/merchant/merchant.service";
import { ReferralProgramEntity } from "./referral.program.entity";
import { IReferralProgramCreateDto } from "./interfaces";
import { ReferralProgramSearchDto } from "./dto";
import { sorter } from "../../../../common/utils/sorter";

@Injectable()
export class ReferralProgramService {
  constructor(
    @InjectRepository(ReferralProgramEntity)
    private readonly referralProgramEntityRepository: Repository<ReferralProgramEntity>,
    protected readonly merchantService: MerchantService,
  ) {}

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

  public async findRefProgram(
    dto: ReferralProgramSearchDto,
    userEntity: UserEntity,
  ): Promise<[Array<ReferralProgramEntity>, number]> {
    const { merchantIds, skip, take } = dto;
    const queryBuilder = this.referralProgramEntityRepository.createQueryBuilder("program");

    queryBuilder.leftJoinAndSelect("program.merchant", "merchant");

    queryBuilder.select();

    // GET ALL
    if (userEntity.userRoles.includes(UserRole.SUPER)) {
      if (merchantIds) {
        if (merchantIds.length === 1) {
          queryBuilder.andWhere("program.merchantId = :merchantId", {
            merchantId: merchantIds[0],
          });
        } else {
          queryBuilder.andWhere("program.merchantId IN(:...merchantIds)", { merchantIds });
        }
      }
    } else {
      // GET USER's
      queryBuilder.andWhere("program.merchantId = :merchantId", {
        merchantId: userEntity.merchantId,
      });
    }

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    queryBuilder.orderBy({
      "program.level": "ASC",
    });

    return queryBuilder.getManyAndCount();
  }

  public async findAllWithRelations(merchantId: number, userEntity: UserEntity): Promise<Array<ReferralProgramEntity>> {
    // TEST USER ROLE
    if (merchantId !== userEntity.merchantId) {
      if (userEntity.userRoles.includes(UserRole.SUPER)) {
        return await this.findAll({ merchantId }, { relations: { merchant: true } });
      } else {
        throw new ForbiddenException("insufficientPermissions");
      }
    } else {
      return await this.findAll({ merchantId }, { relations: { merchant: true } });
    }
  }

  public async createRefProgram(
    dto: IReferralProgramCreateDto,
    userEntity: UserEntity,
  ): Promise<ReferralProgramEntity[]> {
    const { merchantId, levels } = dto;
    // TEST MERCHANT
    const merchantEntity = await this.merchantService.findOne({ id: dto.merchantId });
    if (!merchantEntity) {
      throw new NotFoundException("merchantNotFound");
    }

    // TODO test program doesn't exist
    if (merchantId === userEntity.merchantId || userEntity.userRoles.includes(UserRole.SUPER)) {
      // CREATE ALL REF PROGRAM LEVELS
      const levelsArr = [];
      for (const level of levels.sort(sorter("level"))) {
        levelsArr.push(
          await this.create({
            merchantId,
            level: level.level,
            share: level.share,
          }),
        );
      }
      return levelsArr;
      // return Promise.all(
      //   levels.sort(sorter("level")).map(
      //     async level =>
      //       await this.create({
      //         merchantId,
      //         level: level.level,
      //         share: level.share,
      //       }),
      //   ),
      // );
    } else {
      throw new ForbiddenException("insufficientPermissions");
    }
  }

  public async updateRefProgram(
    merchantId: number,
    dto: IReferralProgramCreateDto,
    userEntity: UserEntity,
  ): Promise<ReferralProgramEntity[]> {
    if (merchantId !== userEntity.merchantId) {
      if (userEntity.userRoles.includes(UserRole.SUPER)) {
        // const refProgram = await this.findAllWithRelations(merchantId, userEntity);
        // await Promise.all(refProgram.map(async lev => await this.deleteIfExist({ id: lev.id })));
        // REMOVE OLD
        await this.deleteProgram(merchantId);
        // CREATE NEW
        return await this.createRefProgram(dto, userEntity);
      } else {
        throw new ForbiddenException("insufficientPermissions");
      }
    } else {
      // REMOVE OLD
      await this.deleteProgram(merchantId);
      // CREATE NEW
      return await this.createRefProgram(dto, userEntity);
    }
  }

  public async deleteLevelIfExist(where: FindOptionsWhere<ReferralProgramEntity>): Promise<void> {
    const entity = await this.findOne(where);
    if (entity) {
      await entity.remove();
    }
  }

  public async deleteProgram(merchantId: number): Promise<void> {
    const programLevels = await this.findAll({ merchantId });
    if (programLevels && programLevels.length > 0) {
      await Promise.all(programLevels.map(level => level.remove()));
    }
  }
}
