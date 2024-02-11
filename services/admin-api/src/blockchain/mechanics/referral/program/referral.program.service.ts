import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindManyOptions, FindOneOptions, FindOptionsWhere, Repository, DeepPartial } from "typeorm";

import { ReferralProgramEntity } from "./referral.program.entity";
import { UserEntity } from "../../../../infrastructure/user/user.entity";
import { IReferralProgramCreateDto, IReferralProgramUpdateDto } from "./interfaces";
import { MerchantService } from "../../../../infrastructure/merchant/merchant.service";
import { ReferralProgramSearchDto, ReferralProgramUpdateDto } from "./dto";
import { UserRole } from "@framework/types";

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

  public async createRefProgram(dto: IReferralProgramCreateDto, userEntity: UserEntity): Promise<void> {
    const { merchantId, levels } = dto;
    // TEST MERCHANT
    if (merchantId === userEntity.merchantId) {
      const merchantEntity = await this.merchantService.findOne({ id: dto.merchantId });
      if (!merchantEntity) {
        throw new NotFoundException("merchantNotFound");
      }

      // CREATE ALL REF PROGRAM LEVELS
      await Promise.all(
        levels.map(
          async (level, indx) =>
            await this.create({
              merchantId,
              level: indx,
              share: level.share,
            }),
        ),
      );
    } else {
      throw new ForbiddenException("insufficientPermissions");
    }
  }

  public async updateRefProgram(
    merchantId: number,
    dto: IReferralProgramUpdateDto,
    userEntity: UserEntity,
  ): Promise<void> {
    const { levels } = dto;

    if (userEntity.userRoles.includes(UserRole.SUPER) || userEntity.merchantId === merchantId) {
      const merchantEntity = await this.merchantService.findOne({ id: dto.merchantId });
      if (!merchantEntity) {
        throw new NotFoundException("merchantNotFound");
      }
      const refProgram = await this.findAllWithRelations(merchantId, userEntity);
      // remove old
      await Promise.all(refProgram.map(async lev => await this.deleteIfExist({ id: lev.id })));
      await this.createRefProgram(dto, userEntity);
    }

    // TEST MERCHANT
    if (merchantId === userEntity.merchantId) {
      const merchantEntity = await this.merchantService.findOne({ id: dto.merchantId });
      if (!merchantEntity) {
        throw new NotFoundException("merchantNotFound");
      }

      // CREATE ALL REF PROGRAM LEVELS
      await Promise.all(
        levels.map(
          async (level, indx) =>
            await this.create({
              merchantId,
              level: indx,
              share: level.share,
            }),
        ),
      );
    } else {
      throw new ForbiddenException("insufficientPermissions");
    }
  }

  public async deleteIfExist(where: FindOptionsWhere<ReferralProgramEntity>): Promise<void> {
    const entity = await this.findOne(where);
    if (entity) {
      await entity.remove();
    }
  }
}
