import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";

import type { IMerchantSearchDto } from "@framework/types";
import { MerchantStatus, UserRole } from "@framework/types";

import { MerchantEntity } from "./merchant.entity";
import type { IMerchantCreateDto, IMerchantUpdateDto } from "./interfaces";
import { UserEntity } from "../user/user.entity";

@Injectable()
export class MerchantService {
  constructor(
    @InjectRepository(MerchantEntity)
    private readonly merchantEntityRepository: Repository<MerchantEntity>,
  ) {}

  public search(dto: IMerchantSearchDto): Promise<[Array<MerchantEntity>, number]> {
    const { merchantStatus, query, skip, take } = dto;

    const queryBuilder = this.merchantEntityRepository.createQueryBuilder("merchant");

    queryBuilder.select();

    if (query) {
      queryBuilder.leftJoin(
        qb => {
          qb.getQuery = () => `LATERAL json_array_elements(merchant.description->'blocks')`;
          return qb;
        },
        `blocks`,
        `TRUE`,
      );
      queryBuilder.andWhere(
        new Brackets(qb => {
          qb.where("merchant.title ILIKE '%' || :title || '%'", { title: query });
          qb.orWhere("blocks->>'text' ILIKE '%' || :description || '%'", { description: query });
        }),
      );
    }

    if (merchantStatus && merchantStatus.length) {
      if (merchantStatus.length === 1) {
        queryBuilder.andWhere("merchant.merchantStatus = :merchantStatus", { merchantStatus: merchantStatus[0] });
      } else {
        queryBuilder.andWhere("merchant.merchantStatus IN(:...merchantStatus)", { merchantStatus });
      }
    }

    queryBuilder.leftJoinAndSelect("merchant.users", "user");

    queryBuilder.orderBy("merchant.createdAt", "DESC");

    queryBuilder.skip(skip);
    queryBuilder.take(take);

    return queryBuilder.getManyAndCount();
  }

  public async autocomplete(): Promise<Array<MerchantEntity>> {
    return this.merchantEntityRepository.find({
      where: {
        merchantStatus: MerchantStatus.ACTIVE,
      },
      select: {
        id: true,
        title: true,
      },
    });
  }

  public findOne(
    where: FindOptionsWhere<MerchantEntity>,
    options?: FindOneOptions<MerchantEntity>,
  ): Promise<MerchantEntity | null> {
    return this.merchantEntityRepository.findOne({ where, ...options });
  }

  public async update(
    where: FindOptionsWhere<MerchantEntity>,
    dto: IMerchantUpdateDto,
    userEntity: UserEntity,
  ): Promise<MerchantEntity | null> {
    const { userIds, ...rest } = dto;

    const merchantEntity = await this.merchantEntityRepository.findOne({ where });

    if (!merchantEntity) {
      throw new NotFoundException("merchantNotFound");
    }

    Object.assign(merchantEntity, rest);

    if (userEntity.userRoles.includes(UserRole.ADMIN)) {
      Object.assign(merchantEntity, {
        users: userIds.map(id => ({ id })),
      });
    }

    return merchantEntity.save();
  }

  public async create(dto: IMerchantCreateDto, userEntity: UserEntity): Promise<MerchantEntity> {
    const { userIds, ...rest } = dto;

    return this.merchantEntityRepository
      .create({
        ...rest,
        merchantStatus: userEntity.userRoles.includes(UserRole.ADMIN) ? MerchantStatus.ACTIVE : MerchantStatus.PENDING,
        users: userEntity.userRoles.includes(UserRole.ADMIN) ? userIds.map(id => ({ id })) : [userEntity],
      })
      .save();
  }

  public async delete(where: FindOptionsWhere<MerchantEntity>, userEntity: UserEntity): Promise<MerchantEntity | null> {
    const merchantEntity = await this.merchantEntityRepository.findOne({ where });

    if (!merchantEntity) {
      throw new NotFoundException("merchantNotFound");
    }

    const isAdmin = userEntity.userRoles.includes(UserRole.ADMIN);
    const isSelf = userEntity.userRoles.includes(UserRole.OWNER) && userEntity.merchantId === merchantEntity.id;

    if (!(isAdmin || isSelf)) {
      throw new ForbiddenException("insufficientPermissions");
    }

    Object.assign(merchantEntity, { merchantStatus: MerchantStatus.INACTIVE });

    return merchantEntity.save();
  }
}
